from pyramid.view import view_config
from pyramid.response import Response
from pyramid.httpexceptions import HTTPBadRequest, HTTPNotFound, HTTPInternalServerError
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from ..models import Grup, grup_anggota, User, ChatMessage, Ajakan  # tambahkan model terkait bila ada

# POST: Buat grup
@view_config(route_name='grup', renderer='json', request_method='POST')
def create_grup(request):
    session: Session = request.dbsession
    data = request.json_body

    admin_id = data.get("admin_id")
    anggota_nim = data.get("anggota_nim", [])

    if not admin_id or not anggota_nim:
        raise HTTPBadRequest(json_body={"message": "admin_id dan anggota_nim wajib diisi"})

    try:
        grup = Grup(admin_id=admin_id)
        anggota_users = session.query(User).filter(User.nim.in_(anggota_nim)).all()

        if not anggota_users:
            raise HTTPBadRequest(json_body={"message": "Tidak ada anggota yang ditemukan berdasarkan nim"})

        grup.anggota.extend(anggota_users)
        session.add(grup)
        session.flush()

        return {"status": "success", "grup_id": grup.id}
    except SQLAlchemyError as e:
        session.rollback()
        raise HTTPInternalServerError(json_body={"message": "Gagal membuat grup", "error": str(e)})


# GET: Semua grup milik user berdasarkan nim
@view_config(route_name='grup', renderer='json', request_method='GET')
def get_grups_by_user(request):
    session: Session = request.dbsession
    nim = request.params.get("nim")

    if not nim:
        raise HTTPBadRequest(json_body={"message": "nim diperlukan"})

    user = session.query(User).filter_by(nim=nim).first()
    if not user:
        raise HTTPNotFound(json_body={"message": "User tidak ditemukan"})

    grups = session.query(Grup).filter(
        (Grup.admin_id == user.id) |
        (Grup.id.in_(
            session.query(grup_anggota.c.grup_id).filter_by(user_id=user.id)
        ))
    ).all()

    return [{
        "id": g.id,
        "admin_id": g.admin_id,
        "anggota": [
            {
                "id": a.id,
                "nim": a.nim,
                "nama_lengkap": a.nama_lengkap
            } for a in g.anggota
        ]
    } for g in grups]


# GET: Detail grup berdasarkan id
@view_config(route_name='grup_detail', renderer='json', request_method='GET')
def get_grup_detail(request):
    session: Session = request.dbsession
    try:
        id = int(request.matchdict['id'])
    except (ValueError, KeyError):
        raise HTTPBadRequest(json_body={"message": "ID tidak valid"})

    grup = session.query(Grup).get(id)

    if not grup:
        raise HTTPNotFound(json_body={"message": "Grup tidak ditemukan"})

    anggota = [{"nim": u.nim, "nama_lengkap": u.nama_lengkap} for u in grup.anggota]

    return {
        "id": grup.id,
        "admin_id": grup.admin_id,
        "anggota": anggota
    }


# DELETE: Hapus grup (hanya admin)
@view_config(route_name='grup_detail', renderer='json', request_method='DELETE')
def delete_grup(request):
    session: Session = request.dbsession
    try:
        id = int(request.matchdict['id'])
    except (ValueError, KeyError):
        raise HTTPBadRequest(json_body={"message": "ID tidak valid"})

    grup = session.query(Grup).get(id)

    if not grup:
        raise HTTPNotFound(json_body={"message": "Grup tidak ditemukan"})

    try:
        # 1. Putuskan relasi anggota (grup_anggota many-to-many)
        grup.anggota.clear()
        session.flush()

        # 2. (Opsional) Hapus entitas terkait lain jika ada
        session.query(ChatMessage).filter_by(grup_id=id).delete()
        session.query(Ajakan).filter_by(grup_id=id).delete()
        session.flush()

        # 3. Hapus entitas grup
        session.delete(grup)
        session.flush()

        return {"status": "deleted", "grup_id": id}
    except SQLAlchemyError as e:
        session.rollback()
        raise HTTPInternalServerError(json_body={"message": "Gagal menghapus grup", "error": str(e)})
