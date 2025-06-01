from pyramid.view import view_config
from pyramid.response import Response
from sqlalchemy.orm import Session
from ..models import JadwalKuliah
from datetime import datetime, timedelta

# CREATE
@view_config(route_name='jadwal', renderer='json', request_method='POST')
def create_jadwal(request):
    data = request.json_body
    session: Session = request.dbsession

    jadwal = JadwalKuliah(
        user_id=data['user_id'],
        hari=data['hari'],
        jam_mulai=data['jam_mulai'],
        jam_selesai=data['jam_selesai'],
        matkul=data['matkul']
    )

    session.add(jadwal)
    session.flush()
    return {"status": "success", "jadwal_id": jadwal.id}

# GET ALL
@view_config(route_name='jadwal', renderer='json', request_method='GET')
def get_jadwal(request):
    session: Session = request.dbsession
    user_id = request.params.get("user_id")

    if not user_id:
        return Response(json_body={"message": "user_id diperlukan"}, status=400)

    rows = session.query(JadwalKuliah).filter_by(user_id=user_id).all()
    return [
        {
            "id": r.id,
            "hari": r.hari,
            "jam_mulai": r.jam_mulai,
            "jam_selesai": r.jam_selesai,
            "matkul": r.matkul
        } for r in rows
    ]

# GET BY ID
@view_config(route_name='jadwal_detail', renderer='json', request_method='GET')
def get_jadwal_by_id(request):
    session: Session = request.dbsession
    id = int(request.matchdict['id'])
    jadwal = session.query(JadwalKuliah).get(id)
    if not jadwal:
        return Response(json_body={"message": "Jadwal tidak ditemukan"}, status=404)
    return {
        "id": jadwal.id,
        "user_id": jadwal.user_id,
        "hari": jadwal.hari,
        "jam_mulai": jadwal.jam_mulai,
        "jam_selesai": jadwal.jam_selesai,
        "matkul": jadwal.matkul
    }

# UPDATE
@view_config(route_name='jadwal_detail', renderer='json', request_method='PUT')
def update_jadwal(request):
    session: Session = request.dbsession
    id = int(request.matchdict['id'])
    data = request.json_body
    jadwal = session.query(JadwalKuliah).get(id)

    if not jadwal:
        return Response(json_body={"message": "Jadwal tidak ditemukan"}, status=404)

    jadwal.hari = data.get("hari", jadwal.hari)
    jadwal.jam_mulai = data.get("jam_mulai", jadwal.jam_mulai)
    jadwal.jam_selesai = data.get("jam_selesai", jadwal.jam_selesai)
    jadwal.matkul = data.get("matkul", jadwal.matkul)

    session.flush()
    return {"status": "updated", "jadwal_id": jadwal.id}

# DELETE
@view_config(route_name='jadwal_detail', renderer='json', request_method='DELETE')
def delete_jadwal(request):
    session: Session = request.dbsession
    id = int(request.matchdict['id'])
    jadwal = session.query(JadwalKuliah).get(id)

    if not jadwal:
        return Response(json_body={"message": "Jadwal tidak ditemukan"}, status=404)

    session.delete(jadwal)
    session.flush()
    return {"status": "deleted", "jadwal_id": id}


@view_config(route_name='cari_jadwal_kosong', renderer='json', request_method='POST')
def cari_jadwal_kosong(request):
    data = request.json_body
    anggota_ids = data.get("anggota_ids")
    session: Session = request.dbsession

    if not anggota_ids:
        return Response(json_body={"error": "anggota_ids tidak boleh kosong"}, status=400)

    jam_mulai = datetime.strptime("07:00", "%H:%M")
    jam_selesai = datetime.strptime("21:00", "%H:%M")
    hasil = {}
    hari_list = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"]

    for hari in hari_list:
        jadwal = session.query(JadwalKuliah).filter(
            JadwalKuliah.user_id.in_(anggota_ids),
            JadwalKuliah.hari == hari
        ).all()

        terisi = []
        for j in jadwal:
            mulai = datetime.strptime(j.jam_mulai, "%H:%M")
            selesai = datetime.strptime(j.jam_selesai, "%H:%M")
            terisi.append((mulai, selesai))

        terisi.sort()
        kosong = []
        pointer = jam_mulai

        for start, end in terisi:
            if pointer + timedelta(hours=2) <= start:
                kosong.append((pointer, start))
            pointer = max(pointer, end)

        if pointer + timedelta(hours=2) <= jam_selesai:
            kosong.append((pointer, jam_selesai))

        hasil[hari] = [
            f"{mulai.strftime('%H:%M')}–{selesai.strftime('%H:%M')}"
            for mulai, selesai in kosong
            if (selesai - mulai) >= timedelta(hours=2)
        ]

    return hasil