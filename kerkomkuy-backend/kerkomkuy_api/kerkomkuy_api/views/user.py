from pyramid.view import view_config
from pyramid.response import Response
from sqlalchemy.exc import IntegrityError
from ..models import User

# CREATE USER
@view_config(route_name='users', renderer='json', request_method='POST')
def create_user(request):
    data = request.json_body
    session = request.dbsession
    user = User(
        nim=data['nim'],
        nama_lengkap=data['nama_lengkap'],
        password=data['password']
    )
    try:
        session.add(user)
        session.flush()
        return {"status": "success", "user_id": user.id}
    except IntegrityError:
        session.rollback()
        return Response(json_body={"status": "error", "message": "NIM sudah digunakan"}, status=400)

# GET ALL USERS
@view_config(route_name='users', renderer='json', request_method='GET')
def get_users(request):
    session = request.dbsession
    users = session.query(User).all()
    return [{"id": u.id, "nim": u.nim, "nama_lengkap": u.nama_lengkap} for u in users]

# GET USER BY ID
@view_config(route_name='user', renderer='json', request_method='GET')
def get_user(request):
    session = request.dbsession
    user_id = int(request.matchdict['id'])
    user = session.query(User).get(user_id)
    if not user:
        return Response(json_body={"message": "User tidak ditemukan"}, status=404)
    return {"id": user.id, "nim": user.nim, "nama_lengkap": user.nama_lengkap}

# UPDATE USER
@view_config(route_name='user', renderer='json', request_method='PUT')
def update_user(request):
    session = request.dbsession
    user_id = int(request.matchdict['id'])
    data = request.json_body
    user = session.query(User).get(user_id)
    if not user:
        return Response(json_body={"message": "User tidak ditemukan"}, status=404)
    
    try:
        user.nim = data.get("nim", user.nim)
        user.nama_lengkap = data.get("nama_lengkap", user.nama_lengkap)
        if "password" in data:
            user.password = data["password"]
        session.flush()
        return {"status": "updated", "user_id": user.id}
    except IntegrityError:
        session.rollback()
        return Response(json_body={"status": "error", "message": "NIM sudah digunakan"}, status=400)

# DELETE USER
@view_config(route_name='user', renderer='json', request_method='DELETE')
def delete_user(request):
    session = request.dbsession
    user_id = int(request.matchdict['id'])
    user = session.query(User).get(user_id)
    if not user:
        return Response(json_body={"message": "User tidak ditemukan"}, status=404)
    session.delete(user)
    session.flush()
    return {"status": "deleted", "user_id": user_id}
