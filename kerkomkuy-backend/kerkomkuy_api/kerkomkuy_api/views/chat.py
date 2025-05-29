from pyramid.view import view_config
from pyramid.response import Response
from sqlalchemy.orm import Session
from ..models import ChatMessage
from datetime import datetime

# GET CHAT BY GRUP_ID
@view_config(route_name='chat', renderer='json', request_method='GET')
def get_chat(request):
    session: Session = request.dbsession
    grup_id = int(request.matchdict['grup_id'])
    pesan = session.query(ChatMessage).filter_by(grup_id=grup_id).order_by(ChatMessage.waktu).all()
    return [
        {
            "id": p.id,
            "sender_nim": p.sender_nim,
            "teks": p.teks,
            "waktu": p.waktu.isoformat()
        }
        for p in pesan
    ]

# POST CHAT MESSAGE
@view_config(route_name='chat', renderer='json', request_method='POST')
def send_chat(request):
    session: Session = request.dbsession
    grup_id = int(request.matchdict['grup_id'])
    data = request.json_body

    msg = ChatMessage(
        grup_id=grup_id,
        sender_nim=data['sender_nim'],
        teks=data['teks'],
        waktu=datetime.utcnow()
    )
    session.add(msg)
    session.flush()
    return {"status": "sent", "chat_id": msg.id}
