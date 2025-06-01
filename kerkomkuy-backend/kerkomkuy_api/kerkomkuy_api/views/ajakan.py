from pyramid.view import view_config
from pyramid.response import Response
from sqlalchemy.orm import Session
from ..models import Ajakan

# Kirim Ajakan
@view_config(route_name='ajakan', renderer='json', request_method='POST')
def create_ajakan(request):
    data = request.json_body
    session: Session = request.dbsession

    ajakan = Ajakan(
        dari_user_id=data['dari_user_id'],
        ke_user_id=data['ke_user_id'],
        grup_id=data['grup_id'],
        status="pending"
    )
    session.add(ajakan)
    session.flush()
    return {"status": "sent", "ajakan_id": ajakan.id}

# Ambil Ajakan Masuk untuk User
@view_config(route_name='ajakan', renderer='json', request_method='GET')
def get_ajakan_for_user(request):
    session: Session = request.dbsession
    user_id = request.params.get("user_id")

    if not user_id:
        return Response(json_body={"message": "user_id dibutuhkan"}, status=400)    # Hanya ambil ajakan yang masih pending
    rows = session.query(Ajakan).filter_by(ke_user_id=user_id, status="pending").all()
    return [
        {
            "id": a.id,
            "dari_user_id": a.dari_user_id,
            "grup_id": a.grup_id,
            "status": a.status
        } for a in rows
    ]

# Ubah Status Ajakan
@view_config(route_name='ajakan_detail', renderer='json', request_method='PUT')
def update_ajakan(request):
    session: Session = request.dbsession
    id = int(request.matchdict['id'])
    data = request.json_body
    ajakan = session.query(Ajakan).get(id)

    if not ajakan:
        return Response(json_body={"message": "Ajakan tidak ditemukan"}, status=404)

    new_status = data.get("status")
    if new_status not in ["accepted", "rejected"]:
        return Response(json_body={"message": "Status tidak valid"}, status=400)

    ajakan.status = new_status
    session.flush()
    return {"status": "updated", "ajakan_id": ajakan.id}
