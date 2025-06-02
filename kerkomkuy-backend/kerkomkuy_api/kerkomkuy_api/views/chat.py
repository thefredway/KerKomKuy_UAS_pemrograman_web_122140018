from pyramid.view import view_config
from pyramid.response import Response
from pyramid.httpexceptions import HTTPBadRequest, HTTPNotFound, HTTPInternalServerError
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from ..models import ChatMessage, Grup
from datetime import datetime

# GET CHAT BY grup_id (query parameter)
@view_config(route_name='chat', renderer='json', request_method='GET')
def get_chat(request):
    session: Session = request.dbsession
    grup_id = request.params.get("grup_id")

    if not grup_id:
        raise HTTPBadRequest(json_body={"message": "Parameter grup_id diperlukan"})

    try:
        grup_id = int(grup_id)
    except ValueError:
        raise HTTPBadRequest(json_body={"message": "grup_id harus berupa angka"})

    try:
        # Optional: cek apakah grup ada
        grup = session.query(Grup).get(grup_id)
        if not grup:
            raise HTTPNotFound(json_body={"message": "Grup tidak ditemukan"})

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
    except SQLAlchemyError as e:
        raise HTTPInternalServerError(json_body={"message": "Gagal mengambil data chat", "error": str(e)})


# POST CHAT MESSAGE (query parameter)
@view_config(route_name='chat', renderer='json', request_method='POST')
def send_chat(request):
    session: Session = request.dbsession
    grup_id = request.params.get("grup_id")

    if not grup_id:
        raise HTTPBadRequest(json_body={"message": "Parameter grup_id diperlukan"})

    try:
        grup_id = int(grup_id)
    except ValueError:
        raise HTTPBadRequest(json_body={"message": "grup_id harus berupa angka"})

    data = request.json_body

    sender_nim = data.get("sender_nim")
    teks = data.get("teks")

    if not sender_nim or not teks:
        raise HTTPBadRequest(json_body={"message": "Field sender_nim dan teks wajib diisi"})

    try:
        # Optional: pastikan grup memang ada
        if not session.query(Grup).get(grup_id):
            raise HTTPNotFound(json_body={"message": "Grup tidak ditemukan"})

        msg = ChatMessage(
            grup_id=grup_id,
            sender_nim=sender_nim,
            teks=teks,
            waktu=datetime.utcnow()
        )

        session.add(msg)
        session.flush()

        return {
            "status": "sent",
            "chat_id": msg.id,
            "timestamp": msg.waktu.isoformat()
        }
    except SQLAlchemyError as e:
        session.rollback()
        raise HTTPInternalServerError(json_body={"message": "Gagal mengirim pesan", "error": str(e)})
