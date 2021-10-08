select move_name, frequency, win_perc from 
(
	select move_name, frequency, win_perc from 
	(
		select move_id, frequency, round(100.0*num_wins/num_matches, 3) as win_perc from
		(
			select move_id, frequency, count(match_id) as num_wins from
			(
				select match_id, move_id, frequency from
				(
					select match_id, move_id from
					(
						select match_id, white_move as move_id from 
						chess_player_moves_by_match
						where move_index=0
					) as t1
					join chess_match using(match_id) 
					where match_result='White' 
				) as t1
				join 
				(
					select white_move as move_id, count(white_move) as frequency
					from chess_player_moves_by_match
					where move_index=0
					group by white_move
				) as t2 
				using(move_id) 
			) as t3
			group by move_id, frequency 
		) as t4, 
		(
			select count(*) as num_matches from 
			chess_match 
		) 
		as t5 
	) as t6
	join chess_moves using(move_id)
	union
	select move_name, frequency, win_perc from 
	(
		select move_id, frequency, round(100.0*num_wins/num_matches, 3) as win_perc from
		(
			select move_id, frequency, count(match_id) as num_wins from
			(
				select match_id, move_id, frequency from
				(
					select match_id, move_id from
					(
						select match_id, black_move as move_id from 
						chess_player_moves_by_match
						where move_index=0
					) as t1
					join chess_match using(match_id) 
					where match_result='Black' 
				) as t1
				join 
				(
					select black_move as move_id, count(black_move) as frequency
					from chess_player_moves_by_match
					where move_index=0
					group by black_move
				) as t2 
				using(move_id) 
			) as t3
			group by move_id, frequency 
		) as t4, 
		(
			select count(*) as num_matches from 
			chess_match 
		) 
		as t5 
	) as t6
	join chess_moves using(move_id)
	order by frequency desc, win_perc desc
	limit {}
) as t7
where move_name != 'Over'
order by frequency desc, win_perc desc;
