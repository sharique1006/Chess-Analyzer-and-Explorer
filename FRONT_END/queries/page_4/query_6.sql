select case when count=0 then 'No' else 'Yes' end as is_present from
(
	select count(*) from 
	user_match_favourites 
	where user_id=101 and match_id=231
) as t1;