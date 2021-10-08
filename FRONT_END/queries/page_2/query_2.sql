select player_name, num_wins, num_matches from
(
	select player_name, num_wins, num_matches from 
	(
		select player_id, num_wins, num_matches from 
		(
			select player_black as player_id, count(match_id) as num_wins from 
			chess_match
			where match_result='Black'
			group by player_black 
		) as t1 
		join 
		(
			select player_black as player_id, count(match_id) as num_matches from 
			chess_match
			group by player_black 
		) as t2 
		using(player_id) 
	) as t3 
	join chess_player using(player_id)
	order by num_wins desc, num_matches desc, player_name asc
	limit 10
) as t4
order by num_wins desc;