from pyramid.view import view_config
from pyramid.response import Response
from ..models import User
from sqlalchemy.orm import Session

@view_config(route_name='login', renderer='json', request_method='POST')
def login(request):
    data = request.json_body
    nim = data.get('nim')
    password = data.get('password')
    session: Session = request.dbsession

    user = session.query(User).filter_by(nim=nim).first()
    if not user or user.password != password:
        return Response(json_body={"message": "NIM atau password salah"}, status=401)
    
    return {
        "message": "Login berhasil",
        "user": {
            "id": user.id,
            "nim": user.nim,
            "nama_lengkap": user.nama_lengkap
        }
    }
