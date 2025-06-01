from pyramid.view import view_config
from pyramid.response import Response
from sqlalchemy.orm import Session
from ..models import Grup, grup_anggota, User

# POST: Buat grup
@view_config(route_name='grup', renderer='json', request_method='POST')
def create_grup(request):
    data = request.json_body
    session: Session = request.dbsession

    admin_id = data.get("admin_id")
    anggota_nim = data.get("anggota_nim", [])

    if not admin_id or not anggota_nim:
        return Response(json_body={"message": "admin_id dan anggota_nim wajib"}, status=400)

    grup = Grup(admin_id=admin_id)
    anggota_users = session.query(User).filter(User.nim.in_(anggota_nim)).all()
    grup.anggota.extend(anggota_users)

    session.add(grup)
    session.flush()
    return {"status": "success", "grup_id": grup.id}

# GET: Semua grup milik user (query param nim=...)
@view_config(route_name='grup', renderer='json', request_method='GET')
def get_grups_by_user(request):
    session: Session = request.dbsession
    nim = request.params.get("nim")

    if not nim:
        return Response(json_body={"message": "nim diperlukan"}, status=400)

    user = session.query(User).filter_by(nim=nim).first()
    if not user:
        return Response(json_body={"message": "User tidak ditemukan"}, status=404)

    grups = session.query(Grup).filter(
        (Grup.admin_id == user.id) |
        (Grup.id.in_(
            session.query(grup_anggota.c.grup_id).filter_by(user_id=user.id)
        ))
    ).all()

    return [{
        "id": g.id,
        "admin_id": g.admin_id,
        "anggota": [{
            "id": a.id,
            "nim": a.nim,
            "nama_lengkap": a.nama_lengkap
        } for a in g.anggota]
    } for g in grups]

# GET: Detail grup by id
@view_config(route_name='grup_detail', renderer='json', request_method='GET')
def get_grup_detail(request):
    session: Session = request.dbsession
    id = int(request.matchdict['id'])
    grup = session.query(Grup).get(id)

    if not grup:
        return Response(json_body={"message": "Grup tidak ditemukan"}, status=404)

    anggota = [{"nim": u.nim, "nama_lengkap": u.nama_lengkap} for u in grup.anggota]
    return {
        "id": grup.id,
        "admin_id": grup.admin_id,
        "anggota": anggota
    }

# DELETE: Grup
@view_config(route_name='grup_detail', renderer='json', request_method='DELETE')
def delete_grup(request):
    session: Session = request.dbsession
    id = int(request.matchdict['id'])
    grup = session.query(Grup).get(id)

    if not grup:
        return Response(json_body={"message": "Grup tidak ditemukan"}, status=404)

    session.delete(grup)
    session.flush()
    return {"status": "deleted", "grup_id": id}
