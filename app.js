var esl = require('modesl');
var format = require('stringformat');
var request = require('request');
var restify = require('restify');
//var config = require('config');



var map = [];



var esl_server = new esl.Server({port: 8084, myevents:true}, function() {
    console.log("esl server is up");
});


var server = restify.createServer();
server.use(restify.fullResponse()).use(restify.bodyParser());
server.listen(8082);


server.get('/originate/:sessionid/:destination', function (req, res, next) {

    //eventEmitter.emit('originate', req.params.sessionid,req.params.destination);

    var id = req.params.sessionid;
    var destination = req.params.destination;


    console.log(id , destination);
    var session;
    var connection;

    function GetElement(element) {
        if (element.id == id) {
            return true;
        } else {
            return false;
        }
    }

    var arrByID = map.filter(GetElement);


    if (arrByID.length > 0) {

        session = arrByID[0].session;
        connection = arrByID[0].connection;
    }

    if(session){

        var url = format("http://{0}:8080/api/originate?", session.fsIP);
        var params = format('{return_ring_ready=true,Originate_session_uuid={0}{1}',id,'}');
        var socketdata = format('&socket({0}:{1} async full)', '127.0.0.1',8084);
        var args = format('{3} {0}user/{1} {2}',params, destination,socketdata, url);

        console.log(args);

        request(args, function (error, response, body) {
            if (!error && response.statusCode == 200) {

                console.log(body);
            }
            else{


            }
        })

    }else{


    }


    //res.write("{'message':'hello, world'}");
    res.end();
});



var bridge = function(uuid, otheruuid, pbxrequire){

    console.log(uuid , otheruuid);
    var session;
    var connection;


    var otherSession;
    var otherConnection;

    function GetElement(element) {
        if (element.id == uuid) {
            return true;
        } else {
            return false;
        }
    }


    function GetOtherElement(element) {
        if (element.id == otheruuid) {
            return true;
        } else {
            return false;
        }
    }

    var arrByID = map.filter(GetElement);
    var otherArrayById = map.filter(GetOtherElement);

    if (arrByID.length > 0) {

        session = arrByID[0].session;
        connection = arrByID[0].connection;
    }



    if (otherArrayById.length > 0) {

        otherSession = otherArrayById[0].session;
        otherConnection = otherArrayById[0].connection;
    }



    if(session && connection && otherSession && otherConnection && connection.connected() && otherConnection.connected()){

        try {


            if (pbxrequire) {

                otherConnection.execute('bind_meta_app', '3 ab s execute_extension::att_xfer XML PBXFeatures');
                otherConnection.execute('bind_meta_app', '4 ab s execute_extension::att_xfer_group XML PBXFeatures');
                otherConnection.execute('bind_meta_app', '5 ab s execute_extension::att_xfer_speed_dial XML PBXFeatures');
                otherConnection.execute('bind_meta_app', '6 ab s execute_extension::att_xfer_outbound XML PBXFeatures');
            }




            var url = format("http://{0}:8080/api/uuid_bridge? {1} {2}", session.fsIP, uuid, otheruuid);

            console.log(url);

            request(url, function (error, response, body) {
                if (!error && response.statusCode == 200) {

                    console.log(body);
                }
                else{


                }
            })


            console.log("After bridge executed--------------------------->>>>>>>>>>>>>>>>>>>>>>>");
        }
        catch(ex){
            console.log("---------------------------------------->-------------------------->---------------------->");
            console.log(ex);

        }
    }else{

    }
};





var handler =  function(evt, body) {


    var uniqueid = evt.getHeader('Unique-ID');
    var connection;
    var session;
    var isPrimary =true;
    var legID =1;


    var cmd;

    function GetElement(element) {
        if (element.id == uniqueid) {
            return true;
        } else {
            return false;
        }
    }

    var arrByID = map.filter(GetElement);


    if (arrByID.length > 0) {

        connection = arrByID[0].connection;
        session = arrByID[0].session;


        if (evt && uniqueid && connection && session) {



            legID = session.legID;
            isPrimary = session.isPrimary;


            // var session = { id : uniqueid};

            console.log(evt.type);

            switch (evt.type) {

                case 'CHANNEL_BRIDGE':

                    try {

                    }
                    catch (ex) {

                    }

                    break;

                case 'CHANNEL_PARK':
                    try {

                    }
                    catch (ex) {

                    }

                    break;

                case 'CHANNEL_ANSWER':

                    try {
                        if(legID == 0){

                           //command: 'playback', arg: format("local_stream://{0}", stream
                            try {
                                var workingID = connection.execute('playback', 'local_stream://default');
                                console.log(workingID);
                            }
                            catch(exp) {

                                console.log(exp);

                            }



                        }else{

                            bridge(session.session, session.id,true);


                        }



                    }
                    catch (ex) {

                    }
                    break;

                case 'CHANNEL_UNBRIDGE':

                    try {

                    }
                    catch (ex) {

                    }

                    break;

                case 'RECV_INFO':

                    try {

                    }
                    catch (ex) {

                    }

                    break;

                case 'MESSAGE':

                    try {

                    }
                    catch (ex) {

                    }

                    break;

                case 'DTMF':
                    try {

                    }
                    catch (ex) {

                    }
                    break;

                case 'CHANNEL_EXECUTE_COMPLETE':

                    try {
                        var application = evt.getHeader('Application');
                        var result = evt.getHeader('variable_read_result');
                        var digit = evt.getHeader('variable_mydigit');


                        if (application && application == 'play_and_get_digits') {

                            if (result && result == 'success') {


                            }
                            else {


                            }
                        }
                    } catch (ex) {

                    }


                    break;

                case 'PLAYBACK_STOP':
                    try {


                    }
                    catch (ex) {

                    }

                    break;

                case 'CHANNEL_HANGUP_COMPLETE':


                    break;

                case 'CHANNEL_HANGUP':
                    try {


                    }
                    catch (ex) {

                    }
                    break;

                case 'RECORD_STOP':

                    try {


                    }
                    catch (ex) {

                    }
                    break;

                default :
                    //console.log(evt);

                    break;
            }

            /*
             if(cmd){

             try {
             var workingID = connection.execute(cmd.command, cmd.arg)
             console.log(workingID)
             }
             catch(exp) {

             console.log(exp);

             }
             }*/
        }
    }
}

var end =  function(evt, body) {
    this.call_end = new Date().getTime();
    var delta = (this.call_end - this.call_start) / 1000;
    console.log("Call duration " + delta + " seconds");
}

var reply =  function(evt, body) {

    console.log(evt);
}

var disconnect =  function(evt, body) {

    var uniqueid = evt.getHeader('Controlled-Session-UUID');


    var connection;
    var session;

    function GetElement(element) {
        if (element.id == uniqueid) {
            return true;
        } else {
            return false;
        }
    }

    var arrByID = map.filter(GetElement);


    if (arrByID.length > 0) {

        connection = arrByID[0].connection;
        session = arrByID[0].session;
    }


    try {

        if (connection && connection.connected())
            connection.disconnect();


        for (var i = map.length; i--;) {
            if (map[i].id == uniqueid) {
                map.splice(i, 1);

                break;
            }
            ;
        }
    } catch (ex) {

    }

    /*
     if(uniqueid){

     try{
     db.run(format("DELETE FROM Session WHERE CallID = '{0}'", uniqueid));
     localVariable.clear(uniqueid);
     }
     catch(ex){

     console.log(ex);
     }

     }*/
}



esl_server.on('connection::ready', function(conn, id) {

    try {

        var idx = conn.getInfo().getHeader('Unique-ID');
        var from = conn.getInfo().getHeader('Caller-Caller-ID-Number');
        var to = conn.getInfo().getHeader('Caller-Destination-Number');
        var direction = conn.getInfo().getHeader('Call-Direction');
        var channelstatus = conn.getInfo().getHeader('Answer-State');
        var originateSession = conn.getInfo().getHeader('variable_Originate_session_uuid');

        //Core-UUID: 6d2375b0-5183-11e1-b24c-f527b57af954
        //FreeSWITCH-Hostname: freeswitch.local
        //FreeSWITCH-Switchname: freeswitch.local
        //FreeSWITCH-IPv4

        var fsid = conn.getInfo().getHeader('Core-UUID');
        var fsHost = conn.getInfo().getHeader('FreeSWITCH-Hostname');
        var fsName = conn.getInfo().getHeader('FreeSWITCH-Switchname');
        var fsIP = conn.getInfo().getHeader('FreeSWITCH-IPv4');


        var sessionID = idx;
        var isPrimary = true;
        var legID = 0;

        if (originateSession) {
            sessionID = originateSession;
            isPrimary = false;

            function GetElement(element) {
                if (element.session == originateSession) {
                    return true;
                } else {
                    return false;
                }
            }

            var arrofLegs = map.filter(GetElement);

            legID = map.length;


        }


        var session = {
            id: idx,
            session: sessionID,
            from: from,
            to: to,
            direction: direction,
            channelstatus: channelstatus,
            fsID: fsid,
            fsHost: fsHost,
            fsName: fsName,
            fsIP: fsIP,
            isPrimary: isPrimary,
            legID: legID
            //myip: conf[0].externaltcpip,
            //myport: conf[0].externaltcpport
        };
        map.push({id: idx, connection: conn, session: session, state: "initializing"});
        console.log('new call ' + id);
        conn.call_start = new Date().getTime();


        conn.on('esl::end', end);
        conn.on('esl::event::disconnect::notice', disconnect);
        conn.on('esl::event::command::reply', reply);
        conn.on('esl::event::**', handler);

        if (direction == 'outbound') {

            if (channelstatus != 'answered') {

                conn.execute('wait_for_answer');
            }
        } else {

            if (channelstatus != 'answered') {


                try {
                    var workingID = conn.execute('Answer');
                    console.log(workingID)
                }
                catch(exp) {

                    console.log(exp);

                }

            }

        }

    }
    catch (ex) {
    }


    if(!originateSession){

        console.log("New session created -> "+ sessionID);
    }else{

        console.log("Session found -> "+ sessionID);
    }


});
