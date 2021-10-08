from configparser import ConfigParser
import json
import os
import html

from flask import Flask, render_template, json, jsonify, request, send_from_directory, redirect, url_for

import psycopg2
import sys
import datetime
import chess

# Connect to the database


app = Flask(__name__)

# None userid means continuing as guest
userinfo = [None,None,None]
simulationinfo = [None]

def config(filename='chess.ini', section='postgresql'):
    # create a parser
    parser = ConfigParser()
    # read config file
    parser.read(filename)

    # get section, default to postgresql
    db = {}
    if parser.has_section(section):
        params = parser.items(section)
        for param in params:
            db[param[0]] = param[1]
    else:
        raise Exception('Section {0} not found in the {1} file'.format(section, filename))

    return db

params = config()

def getnextuserid():
    connection = psycopg2.connect(**params)
    cursor = connection.cursor()

    with open('queries/registration/query_getmaxuserid.txt','r') as file:
        query = file.read()
    cursor.execute(query)
    query_result = cursor.fetchall()
    if len(query_result)==0: query_result = 0
    else: query_result = query_result[0][0]

    connection.commit()
    cursor.close()

    return query_result

def printdatabase():
    connection = psycopg2.connect(**params)
    cursor = connection.cursor()

    with open('../testusers.sql','r') as file:
        query = file.read()
    cursor.execute(query)
    query_result = cursor.fetchall()
    print(query_result)

    connection.commit()
    cursor.close()
    

@app.route("/submitregistration", methods=['POST'])
def submitregistration():
    connection = psycopg2.connect(**params)
    cursor = connection.cursor()

    data = request.get_json()
    toRet = dict({})

    with open('queries/registration/query_checkexistinguser.txt','r') as file:
        query = file.read()
    cursor.execute(query.format(data['username']))
    query_result = cursor.fetchall()
    if len(query_result)==0:
        # not found this username in DB already
        with open('queries/registration/query_registration.txt','r') as file:
            query = file.read()
        cursor.execute(query.format(1+getnextuserid(),data['username'],data['firstname'],data['lastname'],data['dob'],data['email'],data['phone'],data['skill'],data['password']))
        toRet['alreadyExists'] = False
    else:
        toRet['alreadyExists'] = True

    connection.commit()
    cursor.close()

    return jsonify(toRet)

@app.route("/registration")
def registration():
    return render_template("register.html")

@app.route("/home")
def home():
    return render_template("home.html")

@app.route("/query1")
def query1():
    return render_template("query1.html")


def page_1_query_1(color, win_color, order, limit):
    connection = psycopg2.connect(**params)
    cursor = connection.cursor()
    with open('queries/page_1/query_1.txt', 'r') as file:
        query = file.read()
    query = query.format(color, win_color, color, color, color, limit, order)
    cursor.execute(query)
    query_result = cursor.fetchall()
    connection.commit()
    cursor.close()
    return query_result

def page_1_query_2(order, limit):
    connection = psycopg2.connect(**params)
    cursor = connection.cursor()
    with open('queries/page_1/query_2.txt', 'r') as file:
        query = file.read()
    query = query.format(limit, order)
    cursor.execute(query)
    query_result = cursor.fetchall()
    connection.commit()
    cursor.close()
    return query_result

@app.route("/query1form", methods=['POST'])
def query1form():
    data = request.get_json()
    color = 'white'
    try:
        if data['both']=='on':
            query_result = page_1_query_2(data['sort1'], data['num'])
            query_result = [(x[0],x[1],float(x[2])) for x in query_result]
            return jsonify({'moves':query_result})
    except:
        color='white'

    try:
        if data['black']=='on':
            color = 'black'
    except:
        color='white'
    
    query_result = page_1_query_1(color, "'White'", data['sort1'], data['num'])
    query_result = [(x[0],x[1],float(x[2])) for x in query_result]
    return jsonify({'moves':query_result})

@app.route("/query2")
def query2():
    return render_template("query2.html")

@app.route("/query2form", methods=['POST'])
def query2form():
    print('got query 2 form request')
    connection = psycopg2.connect(**params)
    cursor = connection.cursor()

    with open('queries/page_2/query_1.txt','r') as file:
        query = file.read()
    cursor.execute(query)
    query_result = cursor.fetchall()

    connection.commit()
    cursor.close()

    return jsonify({'wins':query_result})

@app.route("/query2form_white", methods=['POST'])
def query2form_white():
    data = request.get_json()
    connection = psycopg2.connect(**params)
    cursor = connection.cursor()

    with open('queries/page_2/query_2.txt','r') as file:
        query = file.read()
    cursor.execute(query.format('White','White','White','White','White',data['size'],data['order']))
    query_result = cursor.fetchall()

    connection.commit()
    cursor.close()

    return jsonify({'players':query_result})

@app.route("/query2form_black", methods=['POST'])
def query2form_black():
    data = request.get_json()
    connection = psycopg2.connect(**params)
    cursor = connection.cursor()

    with open('queries/page_2/query_2.txt','r') as file:
        query = file.read()
    cursor.execute(query.format('Black','Black','Black','Black','Black',data['size'],data['order']))
    query_result = cursor.fetchall()

    connection.commit()
    cursor.close()

    return jsonify({'players':query_result})

def page_3_query_1(limit, order):
    connection = psycopg2.connect(**params)
    cursor = connection.cursor()

    with open('queries/page_3/query_1.txt', 'r') as file:
        query = file.read()
    query = query.format(limit, order)
    cursor.execute(query)
    query_result = cursor.fetchall()

    connection.commit()
    cursor.close()

    return query_result

@app.route("/query3form", methods=['POST'])
def query3form():
    data = request.get_json()
    query_result = page_3_query_1(data['num'], data['sort1'])
    query_result = [(x[1],x[2], x[3],x[4],x[0]) for x in query_result]
    return jsonify({'moves':query_result})
    
@app.route("/query3")
def query3():
    return render_template("query3.html")

@app.route("/addFavourite", methods=['POST'])
def addFavourite():
    data = request.get_json()
    connection = psycopg2.connect(**params)
    cursor = connection.cursor()
    with open('queries/page_3/query_3.txt', 'r') as file:
        query = file.read()
    query = query.format(userinfo[0], data['playerid'])
    cursor.execute(query)
    connection.commit()
    cursor.close()
    return jsonify({'addFavourite': None})

@app.route("/remFavourite", methods=['POST'])
def remFavourite():
    data = request.get_json()
    connection = psycopg2.connect(**params)
    cursor = connection.cursor()
    with open('queries/page_3/query_4.txt', 'r') as file:
        query = file.read()
    query = query.format(userinfo[0], data['playerid'])
    cursor.execute(query)
    connection.commit()
    cursor.close()
    return jsonify({'remFavourite': None})

@app.route("/checkFavourite", methods=['POST'])
def checkFavourite():
    data = request.get_json()
    if(userinfo[0]==-1 or userinfo[0]==None): return jsonify({'guest':True})
    connection = psycopg2.connect(**params)
    cursor = connection.cursor()
    with open('queries/page_3/query_5.txt', 'r') as file:
        query = file.read()
    query = query.format(userinfo[0], data['playerid'])
    cursor.execute(query)
    query_result = cursor.fetchall()
    connection.commit()
    cursor.close()
    if query_result[0][0]=='Yes': return jsonify({'isFavourite': True})
    else: return jsonify({'isFavourite': False})

def playerfavtimes(pid):
    connection = psycopg2.connect(**params)
    cursor = connection.cursor()
    with open('queries/page_3/query_playerfavtimes.txt') as file:
        query = file.read()
    query = query.format(pid)
    cursor.execute(query)
    query_result = cursor.fetchall()
    connection.commit()
    cursor.close()
    return query_result[0][0]

@app.route("/getplayerinfo", methods=['POST'])
def getplayerinfo():
    data = request.get_json()
    # TODO insert ID wise query here
    connection = psycopg2.connect(**params)
    cursor = connection.cursor()
    with open('queries/page_3/query_2.txt', 'r') as file:
    	query = file.read()
    query = query.format(data['playerid'])
    cursor.execute(query)
    query_result = cursor.fetchall()
    query_result = [(x[0],x[1],x[2], float(x[3]), x[4], float(x[5]),x[6],x[7],x[8],float(x[9]),x[10],x[11],float(x[12]),x[13],x[14],x[15],x[16],playerfavtimes(data['playerid'])) for x in query_result]
    connection.commit()
    cursor.close()
    return jsonify({'biodata':query_result})

def page_4_query_1(data):
    connection = psycopg2.connect(**params)
    cursor = connection.cursor()
    with open('queries/page_4/query_1.txt', 'r') as file:
        query = file.read()
    from_date = data['date_from'].split("-")
    to_date = data['date_to'].split("-")

    query = query.format(from_date[0],to_date[0],from_date[1],to_date[1],from_date[2],to_date[2], data['sort1'], data['num'])
    cursor.execute(query)
    query_result = cursor.fetchall()
    connection.commit()
    cursor.close()
    return query_result

@app.route("/query4form", methods=['POST'])
def query4form():
    data = request.get_json()
    query_result = page_4_query_1(data)
    query_result = [(x[0],x[1],x[2], x[3], x[4], x[5]) for x in query_result]
    return jsonify({'moves':query_result})

@app.route("/query4")
def query4():
    return render_template("query4.html")


@app.route("/addFavouriteMatch", methods=['POST'])
def addFavouriteMatch():
    data = request.get_json()
    connection = psycopg2.connect(**params)
    cursor = connection.cursor()
    with open('queries/page_4/query_4.txt', 'r') as file:
        query = file.read()
    query = query.format(userinfo[0], data['matchid'])
    cursor.execute(query)
    connection.commit()
    cursor.close()
    return jsonify({'addFavourite': None})

@app.route("/remFavouriteMatch", methods=['POST'])
def remFavouriteMatch():
    data = request.get_json()
    connection = psycopg2.connect(**params)
    cursor = connection.cursor()
    with open('queries/page_4/query_5.txt', 'r') as file:
        query = file.read()
    query = query.format(userinfo[0], data['matchid'])
    cursor.execute(query)
    connection.commit()
    cursor.close()
    return jsonify({'remFavourite': None})

@app.route("/checkFavouriteMatch", methods=['POST'])
def checkFavouriteMatch():
    data = request.get_json()
    if userinfo[0]==-1 or userinfo[0]==None: return jsonify({'guest':True})
    connection = psycopg2.connect(**params)
    cursor = connection.cursor()
    with open('queries/page_4/query_6.txt', 'r') as file:
        query = file.read()
    query = query.format(userinfo[0], data['matchid'])
    cursor.execute(query)
    query_result = cursor.fetchall()
    connection.commit()
    cursor.close()
    if query_result[0][0]=='Yes': return jsonify({'isFavourite': True})
    else: return jsonify({'isFavourite': False})

def page_5_query_1(limit, order):
    connection = psycopg2.connect(**params)
    cursor = connection.cursor()

    with open('queries/page_5/query_1.txt', 'r') as file:
        query = file.read()
    query = query.format(userinfo[0], limit, order)
    cursor.execute(query)
    query_result = cursor.fetchall()
    connection.commit()
    cursor.close()

    return query_result

@app.route("/query5playerform", methods=['POST'])
def query5playerform():
    if userinfo[0]==-1 or userinfo[0]==None: return jsonify({'guest':True})
    data = request.get_json()
    query_result = page_5_query_1(data['num'], data['sort1'])
    query_result = [(x[1],x[2], x[3],x[4],x[0]) for x in query_result]
    return jsonify({'moves':query_result})

@app.route("/query5")
def query5():
    return render_template("query5.html")

def matchfavtimes(pid):
    connection = psycopg2.connect(**params)
    cursor = connection.cursor()
    with open('queries/page_4/query_matchfavtimes.txt') as file:
        query = file.read()
    query = query.format(pid)
    cursor.execute(query)
    query_result = cursor.fetchall()
    connection.commit()
    cursor.close()
    return query_result[0][0]

@app.route("/getmatchinfo", methods=['POST'])
def getmatchinfo():
    data = request.get_json()
    # TODO insert ID wise query here
    connection = psycopg2.connect(**params)
    cursor = connection.cursor()
    with open('queries/page_4/query_2.txt', 'r') as file:
        query = file.read()
    query = query.format(match_id = data['matchid'])
    cursor.execute(query)
    query_result = cursor.fetchall()
    query_result = [(x[0],x[1].strftime("%A, %d %B %Y"),x[2], x[3], x[4], x[5],x[6],x[7],x[8],x[9],x[10],x[11],x[12],matchfavtimes(data['matchid'])) for x in query_result]
    connection.commit()
    cursor.close()
    return jsonify({'biodata':query_result})

def page_6_query_1(data):
    print(data)
    connection = psycopg2.connect(**params)
    cursor = connection.cursor()
    with open('queries/page_6/query_1.txt', 'r') as file:
        query = file.read()
    from_date = data['date_from'].split("-")
    to_date = data['date_to'].split("-")

    query = query.format(userinfo[0], from_date[0],to_date[0],from_date[1],to_date[1],from_date[2],to_date[2], data['sort1'], data['num'])
    cursor.execute(query)
    query_result = cursor.fetchall()
    connection.commit()
    cursor.close()
    return query_result

@app.route("/query6matchform", methods=['POST'])
def query6matchform():
    if userinfo[0]==-1 or userinfo[0]==None: return jsonify({'guest':True})
    data = request.get_json()
    query_result = page_6_query_1(data)
    query_result = [(x[0],x[1],x[2], x[3], x[4], x[5]) for x in query_result]
    return jsonify({'moves':query_result})

@app.route("/query6")
def query6():
    return render_template("query6.html")

@app.route("/getmatchidforsim", methods=['POST'])
def getmatchidforsim():
    return jsonify({'matchid':simulationinfo[0]})

@app.route("/simulateboard", methods=['POST'])
def simulateboard():
    data = request.get_json()
    board = chess.Board()
    connection = psycopg2.connect(**params)
    cursor = connection.cursor()
    with open('queries/page_7/query_1.txt', 'r') as file:
        query = file.read()

    query = query.format(simulationinfo[0],data['moveid'])
    cursor.execute(query)
    query_result = cursor.fetchall()
    move_list = []
    for i in range(data['moveid']):
        if i%2==0: 
            move_list.append(query_result[i//2][0])
            board.push_san(query_result[i//2][0])
        else:
            move_list.append(query_result[i//2][1])
            board.push_san(query_result[i//2][1])

    connection.commit()
    cursor.close()
    return jsonify({'boardstate':board.fen(),'retmoves':len(query_result)})

@app.route("/getfavmatchids", methods=['POST'])
def getallmatchids():
    data = request.get_json()
    connection = psycopg2.connect(**params)
    cursor = connection.cursor()
    with open('queries/page_7/query_2.txt', 'r') as file:
        query = file.read().format(userinfo[0])

    cursor.execute(query)
    query_result = cursor.fetchall()
    query_result = [a[0] for a in query_result]
    connection.commit()
    cursor.close()
    return jsonify({'matchids':query_result})


@app.route("/query7")
def query7():
    return render_template("query7.html")

@app.route("/setsim", methods=['POST'])
def setsim():
    data = request.get_json()
    simulationinfo[0] = data['pid']
    return jsonify({'dummy':False})

@app.route("/submitlogin", methods=['POST'])
def submitlogin():
    connection = psycopg2.connect(**params)
    cursor = connection.cursor()

    data = request.get_json()
    toRet = dict({})
    if 'guest' not in data.keys():
        with open('queries/login/query_checkvaliduser.txt') as file:
            query = file.read()
        cursor.execute(query.format(data['username'],data['password']))
        query_result = cursor.fetchall()

        if len(query_result)==0:
            toRet['validuser'] = False
        else:
            userinfo[0] = query_result[0][0]
            userinfo[1] = data['username']
            userinfo[2] = data['password']
            toRet['validuser'] = True
    else:
        userinfo[0] = -1
        userinfo[1] = -1
        userinfo[2] = -1
        toRet['validuser'] = True
    connection.commit()
    cursor.close()
    return jsonify(toRet)

@app.route("/updateuserinfo", methods=['POST'])
def updateuserinfo():
    data = request.get_json()
    connection = psycopg2.connect(**params)
    cursor = connection.cursor()
    with open('queries/home/query_updateuserinfo.txt') as file:
        query = file.read()
    query = query.format(data['firstname'],data['lastname'],data['dob'],data['email'],data['phone'],data['skill'],data['password'],userinfo[0])
    cursor.execute(query)
    connection.commit()
    cursor.close()
    return jsonify({'updateUser': None})

@app.route("/deluser", methods=['POST'])
def deluser():
    toRet = dict({})
    connection = psycopg2.connect(**params)
    cursor = connection.cursor()

    with open('queries/home/query_deluser.txt') as file:
        query = file.read()
    cursor.execute(query.format(userinfo[0]))

    userinfo[0] = -1
    userinfo[1] = None
    userinfo[2] = None

    connection.commit()
    cursor.close()
    return jsonify(toRet)

@app.route("/getuserinfo", methods=['POST'])
def getuserinfo():
    data = request.get_json()
    toRet = dict({})
    if userinfo[0]==-1 or userinfo[0]==None:
        toRet['guest'] = True
        return jsonify(toRet)
    else:
        toRet['guest'] = False

    connection = psycopg2.connect(**params)
    cursor = connection.cursor()

    with open('queries/home/query_getuserinfo.txt') as file:
        query = file.read()
    cursor.execute(query.format(userinfo[0]))
    query_result = cursor.fetchall()

    toRet['user_name'] = query_result[0][1]
    toRet['user_first_name'] = query_result[0][2]
    toRet['user_last_name'] = query_result[0][3]
    toRet['user_dob'] = query_result[0][4]
    toRet['user_email'] = query_result[0][5]
    toRet['user_phone'] = query_result[0][6]
    toRet['user_skill'] = query_result[0][7]
    toRet['user_password'] = query_result[0][8]

    connection.commit()
    cursor.close()
    return jsonify(toRet)

@app.route("/")
def index():
    userinfo[0] = None
    userinfo[1] = None
    userinfo[2] = None
    return render_template("index.html")

def start_web_frontend():
    print('Starting Chess simulator web interface...')
    app.run(host = '127.0.0.1',  port = 5003, debug = False)
    # app.run(debug=False, use_reloader=False)

if __name__ == "__main__":
    start_web_frontend()
