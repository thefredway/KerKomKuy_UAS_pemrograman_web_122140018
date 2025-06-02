def test_create_user(app):
    res = app.post_json('/api/users', {
        "nim": "999",
        "nama_lengkap": "Test User",
        "password": "secret"
    })
    assert res.json["status"] == "success"

def test_get_users(app):
    res = app.get('/api/users')
    assert isinstance(res.json, list)

def test_update_user(app):
    create = app.post_json('/api/users', {
        "nim": "998",
        "nama_lengkap": "Old Name",
        "password": "pass"
    })
    user_id = create.json["user_id"]
    res = app.put_json(f'/api/users/{user_id}', {
        "nama_lengkap": "New Name"
    })
    assert res.json["status"] == "updated"

def test_delete_user(app):
    create = app.post_json('/api/users', {
        "nim": "997",
        "nama_lengkap": "To Delete",
        "password": "delete"
    })
    user_id = create.json["user_id"]
    res = app.delete(f'/api/users/{user_id}')
    assert res.json["status"] == "deleted"

def test_duplicate_nim(app):
    app.post_json('/api/users', {"nim": "111", "nama_lengkap": "A", "password": "x"})
    res = app.post_json('/api/users', {"nim": "111", "nama_lengkap": "B", "password": "x"}, expect_errors=True)
    assert res.status_code == 400

def test_user_not_found(app):
    res = app.get('/api/users/9999', expect_errors=True)
    assert res.status_code == 404

def test_user_login_success(app):
    app.post_json('/api/users', {"nim": "300", "nama_lengkap": "LoginUser", "password": "abc123"})
    res = app.post_json('/api/login', {"username": "300", "password": "abc123"})
    assert res.status_code == 200
    assert res.json["username"] == "300"

def test_user_login_wrong_password(app):
    app.post_json('/api/users', {"nim": "301", "nama_lengkap": "WrongPass", "password": "abc123"})
    res = app.post_json('/api/login', {"username": "301", "password": "wrong"}, expect_errors=True)
    assert res.status_code == 401

def test_user_login_not_found(app):
    res = app.post_json('/api/login', {"username": "notexist", "password": "nopass"}, expect_errors=True)
    assert res.status_code == 404
