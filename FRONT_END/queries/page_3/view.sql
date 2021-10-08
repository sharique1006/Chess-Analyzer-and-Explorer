create materialized view player_details as
select T19.player_id, num_wins, round(100*num_wins/num_matches, 3) as win_perc, num_loss, round(100*num_loss/num_matches, 3) as loss_perc, num_matches, num_matches_as_black, num_wins_as_black, case when num_matches_as_black=0 then 0 else round(100*num_wins_as_black/num_matches_as_black, 3) end as win_perc_as_black, num_matches_as_white, num_wins_as_white, case when num_matches_as_white=0 then 0 else round(100*num_wins_as_white/num_matches_as_white, 3) end as win_perc_as_white, most_common_opening, most_common_opening_as_black, most_common_opening_as_white, most_active_time from
(
	select T17.player_id, num_wins, num_loss, num_matches, num_matches_as_black, num_wins_as_black, num_matches_as_white, case when num_wins_as_white is NULL then 0 else num_wins_as_white end, most_common_opening, most_common_opening_as_black, most_common_opening_as_white from
	(
		select T15.player_id, num_wins, num_loss, num_matches, num_matches_as_black, num_wins_as_black, case when num_matches_as_white is NULL then 0 else num_matches_as_white end, most_common_opening, most_common_opening_as_black, most_common_opening_as_white from
		(
			select T13.player_id, num_wins, num_loss, num_matches, num_matches_as_black, case when num_wins_as_black is NULL then 0 else num_wins_as_black end, most_common_opening, most_common_opening_as_black, most_common_opening_as_white from
			(
				select T11.player_id, num_wins, num_loss, num_matches, case when num_matches_as_black is NULL then 0 else num_matches_as_black end, most_common_opening, most_common_opening_as_black, most_common_opening_as_white from
				(
					select T9.player_id, num_wins, num_loss, num_matches, most_common_opening, most_common_opening_as_black, most_common_opening_as_white from
					(
						select T7.player_id, num_wins, case when num_loss is NULL then 0 else num_loss end, most_common_opening, most_common_opening_as_black, most_common_opening_as_white from
						(
							select T5.player_id, case when num_wins is NULL then 0 else num_wins end, most_common_opening, most_common_opening_as_black, most_common_opening_as_white from
							(
								select T3.player_id, most_common_opening, most_common_opening_as_black, case when most_common_opening_as_white is NULL then 'Never Opened As White' else most_common_opening_as_white end from
								(
									select T1.player_id, most_common_opening, case when most_common_opening_as_black is NULL then 'Never Opened As Black' else most_common_opening_as_black end from
									(
										select player_id, move_name as most_common_opening from
										(
											select player_id, move_id, num_times, row_number() over(partition by player_id order by num_times desc, move_id asc) as rank from
											(
												select player_id, move_id, count(move_id) as num_times from
												(
													select match_id, player_id, black_move as move_id from 
													(
														select match_id, player_black as player_id from
														chess_match 
													) as t1
													join chess_player_moves_by_match using(match_id)
													where move_index=0
													union
													select match_id, player_id, white_move as move_id from 
													(
														select match_id, player_white as player_id from
														chess_match 
													) as t1
													join chess_player_moves_by_match using(match_id)
													where move_index=0
												) as t2
												group by player_id, move_id
											) as t3
										) as t4
										join chess_moves
										using(move_id)
										where rank=1
									) as T1
									left join
									(
										select player_id, move_name as most_common_opening_as_black from
										(
											select player_id, move_id, num_times, row_number() over(partition by player_id order by num_times desc, move_id asc) as rank from
											(
												select player_id, move_id, count(move_id) as num_times from
												(
													select match_id, player_id, black_move as move_id from 
													(
														select match_id, player_black as player_id from
														chess_match 
													) as t1
													join chess_player_moves_by_match using(match_id)
													where move_index=0
												) as t1
												group by player_id, move_id
											) as t3
										) as t4
										join chess_moves
										using(move_id)
										where rank=1
									) as T2
									on T1.player_id=T2.player_id
								) as T3
								left join
								(
									select player_id, move_name as most_common_opening_as_white from
									(
										select player_id, move_id, num_times, row_number() over(partition by player_id order by num_times desc, move_id asc) as rank from
										(
											select player_id, move_id, count(move_id) as num_times from
											(
												select match_id, player_id, white_move as move_id from 
												(
													select match_id, player_white as player_id from
													chess_match 
												) as t1
												join chess_player_moves_by_match using(match_id)
												where move_index=0
											) as t1
											group by player_id, move_id
										) as t3
									) as t4
									join chess_moves
									using(move_id)
									where rank=1
								) as T4
								on T3.player_id=T4.player_id
							) as T5
							left join
							(
								select distinct on (player_id) player_id, count(match_id) as num_wins from 
								(
									select match_id, player_black as player_id from 
									chess_match 
									where match_result='Black'
									union all
									select match_id, player_white as player_id 
									from chess_match 
									where match_result='White'
								) as t1
								group by player_id
							) as T6
							on T5.player_id=T6.player_id
						) as T7
						left join
						(
							select distinct on (player_id) player_id, count(match_id) as num_loss from 
							(
								select match_id, player_black as player_id from 
								chess_match 
								where match_result='White'
								union all
								select match_id, player_white as player_id from 
								chess_match 
								where match_result='Black'
							) as t1
							group by player_id
						) as T8
						on T7.player_id=T8.player_id
					) as T9
					left join
					(
						select player_id, count(match_id) as num_matches from 
						(
							select match_id, player_black as player_id from
							chess_match
							union all
							select match_id, player_white as player_id from 
							chess_match 
						) as t5
						group by player_id
					) as T10
					on T9.player_id=T10.player_id
				) as T11
				left join
				(
					select player_black as player_id, count(match_id) as num_matches_as_black from
					chess_match
					group by player_black
				) as T12
				on T11.player_id=T12.player_id
			) as T13
			left join
			(
				select player_black as player_id, count(match_id) as num_wins_as_black from
				chess_match
				where match_result='Black'
				group by player_black
			) as T14
			on T13.player_id=T14.player_id
		) as T15
		left join
		(
			select player_white as player_id, count(match_id) as num_matches_as_white from
			chess_match
			group by player_white
		) as T16
		on T15.player_id=T16.player_id
	) as T17
	left join
	(
		select player_white as player_id, count(match_id) as num_wins_as_white from
		chess_match
		where match_result='White'
		group by player_white
	) as T18
	on T17.player_id=T18.player_id
) as T19
left join
(
	select player_id, most_active_time, num_active from
	(
		select player_id, most_active_time, num_active, row_number() over(partition by player_id order by num_active desc, most_active_time asc) as rank from
		(
			select player_id, time as most_active_time, count(time) as num_active from 
			(
				select player_id, time from 
				(
					select match_id, player_black as player_id from chess_match
					union
					select match_id, player_white as player_white from chess_match 
				) as t1
				join chess_match_timings using(match_id) 
			) as t2
			group by player_id, time
		) as t3
	) as t4
	where rank=1
) as T20
on T19.player_id=T20.player_id;