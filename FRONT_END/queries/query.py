import psycopg2
import sys

# Connect to the database
connection = psycopg2.connect(user="postgres", password="postgres", database="postgres")
cursor = connection.cursor()

def page_1_query_1(color, win_color, order, limit):
	with open('page_1/query_1.txt', 'r') as file:
		query = file.read()
	query = query.format(color, win_color, color, color, color, limit, order)
	cursor.execute(query)
	query_result = cursor.fetchall()
	print(query_result)
	return query_result

def page_1_query_2(order, limit):
	with open('page_1/query_2.txt', 'r') as file:
		query = file.read()
	query = query.format(limit, order)
	cursor.execute(query)
	query_result = cursor.fetchall()
	print(query_result)
	return query_result

def page_2_query_1():
	with open('page_2/query_1.txt', 'r') as file:
		query = file.read()
	cursor.execute(query)
	query_result = cursor.fetchall()
	print(query_result)
	return query_result

def page_2_query_2(color, win_color, limit, order):
	with open('page_2/query_2.txt', 'r') as file:
		query = file.read()
	query = query.format(color, win_color, color, color, color, limit, order)
	cursor.execute(query)
	query_result = cursor.fetchall()
	print(query_result)
	return query_result

def page_3_query_1(limit, order):
    with open('page_3/query_1.txt', 'r') as file:
        query = file.read()
    query = query.format(limit, order)
    cursor.execute(query)
    query_result = cursor.fetchall()
    return query_result

def page_3_query_2(player_id):
	with open('page_3/query_2.txt', 'r') as file:
		query = file.read()
	query = query.format(player_id=player_id)
	cursor.execute(query)
	query_result = cursor.fetchall()
	print(query_result)
	return query_result

def page_4_query_1(from_year, to_year, from_month, to_month, from_day, to_day, order, limit):
	with open('page_4/query_1.txt', 'r') as file:
		query = file.read()
	query = query.format(from_year, to_year, from_month, to_month, from_day, to_day, order, limit)
	cursor.execute(query)
	query_result = cursor.fetchall()
	print(query_result)
	return query_result

def page_4_query_2(from_year, to_year, from_month, to_month, from_day, to_day, match_id):
	with open('page_4/query_2.txt', 'r') as file:
		query = file.read()
	query = query.format(match_id, match_id)
	cursor.execute(query)
	query_result = cursor.fetchall()
	print(query_result)
	return query_result

def page_4_query_3(match_id):
	with open('page_4/query_3.txt', 'r') as file:
		query = file.read()
	query = query.format(match_id)
	cursor.execute(query)
	query_result = cursor.fetchall()
	print(query_result)
	return query_result

def page_5_query_1(match_order, winner_order, duration_order, num_moves_order, limit):
	with open('page_5/query_1.txt', 'r') as file:
		query = file.read()
	query = query.format(match_order, winner_order, duration_order, num_moves_order, limit)
	cursor.execute(query)
	query_result = cursor.fetchall()
	print(query_result)
	return query_result

if __name__ == "__main__":
	player_name = "'feligres'"

	page_1_query_1('white', "'White'", 'frequency desc', 10)
	page_1_query_2('frequency desc', 10)
	page_2_query_1()
	page_2_query_2('black', 'Black', 5, 'player_name asc')
	page_3_query_1(10, 'player_name asc')
	page_3_query_2(896)
	page_4_query_1(2011, 2016, 4, 5, 11, 12, 'match_id asc', 5)
	page_4_query_2(2011, 2016, 5, 7, 11, 12, 24000)
	page_4_query_3(24000)
	#page_5_query_1('asc', 'asc', 'asc', 'asc', 5)

cursor.close()
connection.close()
