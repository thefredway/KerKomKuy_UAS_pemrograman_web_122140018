from pyramid.view import view_config
from pyramid.httpexceptions import HTTPBadRequest, HTTPNotFound, HTTPInternalServerError
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from ..models import Grup, grup_anggota, User, ChatMessage, Ajakan

# ---------------------------
# POST: Buat grup baru
# ---------------------------
@view_config(route_name='grup', renderer='json', request_method='POST')
def create_grup(request):
    session: Session = request.dbsession
    data = request.json_body

    admin_id = data.get("admin_id")
    anggota_nim = data.get("anggota_nim", [])
    jadwal = data.get("jadwal", [])

    if not admin_id or not anggota_nim:
        raise HTTPBadRequest(json_body={"message": "admin_id dan anggota_nim wajib diisi"})

    try:
        anggota_users = session.query(User).filter(User.nim.in_(anggota_nim)).all()

        if not anggota_users:
            raise HTTPBadRequest(json_body={"message": "Tidak ditemukan anggota valid berdasarkan NIM"})

        grup = Grup(admin_id=admin_id, jadwal=jadwal)
        grup.anggota.extend(anggota_users)

        session.add(grup)
        session.flush()

        return {"status": "success", "grup_id": grup.id}
    except SQLAlchemyError as e:
        session.rollback()
        raise HTTPInternalServerError(json_body={"message": "Gagal membuat grup", "error": str(e)})

# ---------------------------
# GET: Ambil semua grup milik user berdasarkan NIM
# ---------------------------
@view_config(route_name='grup', renderer='json', request_method='GET')
def get_grups_by_user(request):
    session: Session = request.dbsession
    nim = request.params.get("nim")

    if not nim:
        raise HTTPBadRequest(json_body={"message": "Parameter 'nim' diperlukan"})

    user = session.query(User).filter_by(nim=nim).first()
    if not user:
        raise HTTPNotFound(json_body={"message": "User tidak ditemukan"})

    # 1. Grup di mana user adalah admin
    grup_admin = session.query(Grup).filter(Grup.admin_id == user.id).all()

    # 2. Grup di mana user menerima ajakan
    accepted_grup_ids = session.query(Ajakan.grup_id).filter_by(
        ke_user_id=user.id, status="accepted"
    ).subquery()

    grup_diterima = session.query(Grup).filter(Grup.id.in_(accepted_grup_ids)).all()

    # Gabungkan dan hilangkan duplikat
    all_grups = {g.id: g for g in (grup_admin + grup_diterima)}.values()

    return [{
        "id": g.id,
        "admin_id": g.admin_id,
        "anggota": [{"id": a.id, "nim": a.nim, "nama_lengkap": a.nama_lengkap} for a in g.anggota],
        "jadwal": g.jadwal or []
    } for g in all_grups]

# ---------------------------
# GET: Ambil detail grup berdasarkan ID
# ---------------------------
@view_config(route_name='grup_detail', renderer='json', request_method='GET')
def get_grup_detail(request):
    session: Session = request.dbsession
    try:
        grup_id = int(request.matchdict.get('id'))
    except (ValueError, TypeError):
        raise HTTPBadRequest(json_body={"message": "ID tidak valid"})

    grup = session.query(Grup).get(grup_id)
    if not grup:
        raise HTTPNotFound(json_body={"message": "Grup tidak ditemukan"})

    anggota = [{"nim": u.nim, "nama_lengkap": u.nama_lengkap} for u in grup.anggota]

    return {
        "id": grup.id,
        "admin_id": grup.admin_id,
        "anggota": anggota,
        "jadwal": grup.jadwal or []
    }

# ---------------------------
# DELETE: Hapus grup (hanya oleh admin)
# ---------------------------
@view_config(route_name='grup_detail', renderer='json', request_method='DELETE')
def delete_grup(request):
    session: Session = request.dbsession
    try:
        grup_id = int(request.matchdict.get('id'))
    except (ValueError, TypeError):
        raise HTTPBadRequest(json_body={"message": "ID tidak valid"})

    grup = session.query(Grup).get(grup_id)
    if not grup:
        raise HTTPNotFound(json_body={"message": "Grup tidak ditemukan"})

    try:
        # Putuskan relasi many-to-many
        grup.anggota.clear()
        session.flush()

        # Hapus entitas terkait lain
        session.query(ChatMessage).filter_by(grup_id=grup_id).delete()
        session.query(Ajakan).filter_by(grup_id=grup_id).delete()
        session.flush()

        # Hapus grup
        session.delete(grup)
        session.flush()

        return {"status": "deleted", "grup_id": grup_id}
    except SQLAlchemyError as e:
        session.rollback()
        raise HTTPInternalServerError(json_body={"message": "Gagal menghapus grup", "error": str(e)})
