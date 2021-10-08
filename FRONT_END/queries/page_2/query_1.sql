select color, num_wins, num_matches from (
	select match_result as color, num_wins from 
	(
		select match_result, count(match_result) as num_wins from 
		chess_match
		group by match_result 
	) as t1 
	where match_result='White' or match_result='Black' 
	order by num_wins desc 
) as t2, 
(
	select count(*) as num_matches from chess_match 
) as t3;
