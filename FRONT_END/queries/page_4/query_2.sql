select match_id, date, time, player_black, black_clock, player_black_rating, player_white, player_white_rating, white_clock, winner, duration, num_moves, commentaries from
(
	select match_id, date, time, player_black, black_clock, player_white, white_clock, player_name as winner, duration, num_moves, commentaries from
	(
		select match_id, date, time, player_black, black_clock, player_name as player_white, white_clock, winner, duration, num_moves, commentaries from 
		(
			select match_id, date, time, player_name as player_black, black_clock, player_white, white_clock, winner, duration, num_moves, commentaries from 
			(
				select match_id, date, time, player_black, black_clock, player_white, white_clock, winner, duration, num_moves, commentaries from 
				(
					select match_id, date, time, player_black, black_clock, player_white, white_clock, case when winner ='Black' then player_black else player_white end as winner, time_control as duration, commentaries from 
					(
						select match_id, player_black, player_white, match_result as winner, commentaries from 
						chess_match 
					) as t1 
					join chess_match_timings using(match_id) 
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
		where t5.player_white=player_id and match_id=24000
	) as t6, chess_player
	where t6.winner=player_id
) as t7
join 
(
	select match_id, black_elo as player_black_rating, white_elo as player_white_rating from 
	chess_player_ratings_by_match
	where match_id=24000
) as t8
using (match_id);