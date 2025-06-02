def test_create_jadwal(app):
    user = app.post_json('/api/users', {
        "nim": "901",
        "nama_lengkap": "Jadwal User",
        "password": "pass"
    }).json
    user_id = user["user_id"]

    res = app.post_json('/api/jadwal', {
        "user_id": user_id,
        "hari": "Senin",
        "jam_mulai": "08:00",
        "jam_selesai": "10:00",
        "matkul": "Matematika"
    })
    assert res.json["status"] == "success"

def test_get_jadwal(app):
    user = app.post_json('/api/users', {
        "nim": "902",
        "nama_lengkap": "Jadwal2",
        "password": "pass"
    }).json
    uid = user["user_id"]

    app.post_json('/api/jadwal', {
        "user_id": uid,
        "hari": "Selasa",
        "jam_mulai": "09:00",
        "jam_selesai": "11:00",
        "matkul": "Fisika"
    })

    res = app.get(f'/api/jadwal?user_id={uid}')
    assert isinstance(res.json, list)

def test_get_jadwal_missing_user(app):
    res = app.get('/api/jadwal', expect_errors=True)
    assert res.status_code == 400

def test_jadwal_kosong_search(app):
    u1 = app.post_json('/api/users', {"nim": "801", "nama_lengkap": "U1", "password": "a"}).json
    u2 = app.post_json('/api/users', {"nim": "802", "nama_lengkap": "U2", "password": "a"}).json

    # Tambahkan jadwal
    app.post_json('/api/jadwal', {
        "user_id": u1["user_id"],
        "hari": "Senin",
        "jam_mulai": "07:00",
        "jam_selesai": "09:00",
        "matkul": "A"
    })

    app.post_json('/api/jadwal', {
        "user_id": u2["user_id"],
        "hari": "Senin",
        "jam_mulai": "15:00",
        "jam_selesai": "17:00",
        "matkul": "B"
    })

    res = app.post_json('/api/jadwal-kosong', {
        "user_id_list": [u1["user_id"], u2["user_id"]]
    })
    assert isinstance(res.json, dict)
    assert "Senin" in res.json
