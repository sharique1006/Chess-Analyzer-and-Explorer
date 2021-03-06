select match_id, player_black, player_white, player_name as winner, duration, num_moves from
(
	select match_id, player_black, player_name as player_white, winner, duration, num_moves from 
	(
		select match_id, player_name as player_black, player_white, winner, duration, num_moves from 
		(
			select match_id, player_black, player_white, winner, duration, num_moves from 
			(
				select match_id, player_black, player_white, case when winner ='Black' then player_black else player_white end as winner, time_control as duration from 
				(
					select match_id, player_black, player_white, match_result as winner from 
					chess_match 
				) as t1 
				join chess_match_timings using(match_id) 
				where date_part('year', date) >= 2011 and date_part('year', date) <= 2016 and
				date_part('month', date) >= 5 and date_part('month', date) <= 7 and
				date_part('day', date) >= 11 and date_part('day', date) <= 12
			) as t2 
			join 
			(
				select match_id, count(move_index) as num_moves from 
				chess_player_moves_by_match
				group by match_id 
			) as t3 
			using(match_id) 
		) as t4, chess_player 
		where t4.player_black=player_id 
	) as t5, chess_player
	where t5.player_white=player_id
	order by duration desc
	limit 10
) as t6, chess_player
where t6.winner=player_id;