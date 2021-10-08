select t1.player_id, player_name, num_wins, win_perc, num_loss, loss_perc, num_matches, num_matches_as_black, num_wins_as_black, win_perc_as_black, num_matches_as_white, num_wins_as_white, win_perc_as_white, most_common_opening, most_common_opening_as_black, most_common_opening_as_white, most_active_time from
(
	select * from player_details where player_id=896
) as t1, chess_player 
where t1.player_id=chess_player.player_id;