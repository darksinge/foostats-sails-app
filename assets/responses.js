/**
* @description :: provides json formatting for /docs view.
*/

module.exports = {

    playersGETRoute: function() {
        var response =
        [
            {
                "teams": [
                    {
                        "name": "team awesome",
                        "uuid": "abcd1234-1234-a1b2-c3d4-abc123efg456",
                        "createdAt": "2016-10-21T03:12:58.460Z",
                        "updatedAt": "2016-10-21T03:12:58.460Z"
                    }
                ],
                "achievements": [],
                "email": "john.doe@fakemail.com",
                "name": "John Doe",
                "uuid": "abcd1234-1234-a1b2-c3d4-abc123efg456",
                "role": "basic",
                "createdAt": "2016-10-20T19:57:07.207Z",
                "updatedAt": "2016-10-21T04:24:33.707Z"
            },
            {"...": "..."}
        ]
        return JSON.stringify(response, null, 2);
    },

    teamsGETRoute: function() {
        var response =
        [
            {
                "games": [],
                "players": [
                    {
                        "email": "john.doe@fakemail.com",
                        "name": "John Doe",
                        "uuid": "abcd1234-1234-a1b2-c3d4-abc123efg456",
                        "role": "admin",
                        "createdAt": "2016-10-20T19:57:07.207Z",
                        "updatedAt": "2016-10-21T04:24:33.707Z"
                    }
                ],
                "leagues": [],
                "name": "team awesome",
                "uuid": "abcd1234-1234-a1b2-c3d4-abc123efg456",
                "createdAt": "2016-10-21T03:12:58.460Z",
                "updatedAt": "2016-10-21T03:12:58.460Z"
            },
            {"...": "..."}
        ]
        return JSON.stringify(response, null, 2)
    },



};
