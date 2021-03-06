select player_id, player_name, num_wins, num_loss, num_matches from
(
	select player_id, player_name, num_wins, num_loss, num_matches from
	(
		select player_id from user_player_favourites where user_id=1000
	) as t1
	join
	(
		select t4.player_id, player_name, num_wins, num_loss, case when num_matches is NULL then 0 else num_matches end from 
		(
			select t2.player_id, player_name, num_wins, case when num_loss is NULL then 0 else num_loss end from 
			(
				select chess_player.player_id as player_id, player_name, case when num_wins is NULL then 0 else num_wins end from 
				chess_player
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
				) as t1
				on chess_player.player_id=t1.player_id 
			) as t2
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
			) as t3
			on t2.player_id=t3.player_id 
		) as t4
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
		) as t6
		on t4.player_id=t6.player_id
	) as t2
	using(player_id)
	order by num_wins desc, num_loss desc, num_matches desc, player_name asc
	limit 10
) as t3
order by player_name asc;