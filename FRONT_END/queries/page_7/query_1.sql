select cm1.move_name as white_move, cm2.move_name as black_move 
from
    (
        select move_index, white_move, black_move from 
        chess_player_moves_by_match 
        where match_id=24000
    ) as tab1, chess_moves as cm1, chess_moves as cm2
where cm1.move_id = white_move and cm2.move_id = black_move
order by move_index
