<?php

$playlist = "11081010";

function curl_get($url)
{
    $refer = "http://music.163.com/";
    $header[] = "Cookie: " . "appver=1.5.0.75771;";
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_BINARYTRANSFER, true);
    curl_setopt($ch, CURLOPT_REFERER, $refer);
    $output = curl_exec($ch);
    curl_close($ch);
    return $output;
}

function get_music_lyric($music_id)
{
    $url = "http://music.163.com/api/song/lyric?os=pc&id=" . $music_id . "&lv=-1&kv=-1&tv=-1";
    return curl_get($url);
}

$id = $_REQUEST['id'];
$lrc_info = json_decode(get_music_lyric($id), true);
//歌词开始秒数处理
if (isset($lrc_info["lrc"]["lyric"])) {
    $lrc = explode("\n", $lrc_info["lrc"]["lyric"]);
    array_pop($lrc);
    foreach ($lrc as $rows) {
        $row = explode("]", $rows);
        if (count($row) == 1) {
            $play_info["lrc"] = "no";
            break;
        } else {
            $lyric = array();
            if(count($row) >2){
                if(end($row) != ']'){
                    $col_text = end($row);
                    $row = array_slice($row,0,1);
                }else{
                    $col_text = $row[1] . ']';
                    $row = array_slice($row,0,1);
                }
            }else{
                $col_text = end($row);
                array_pop($row);
            }
            foreach ($row as $key) {
                $time = explode(":", substr($key, 1));
                $time = $time[0] * 60 + $time[1];
                $play_info["lrc"][$time] = $col_text;
            }
        }
    }
} else {
    $play_info["lrc"] = "no";
}

if(isset($lrc_info["tlyric"]["lyric"])){
    $lrc = explode("\n", $lrc_info["tlyric"]["lyric"]);
    if($lrc[count($lrc)-1] == ''){
        array_pop($lrc);
    }
    foreach ($lrc as $rows) {
        $row = explode("]", $rows);
        if (count($row) == 1) {
            break;
        } else {
            $lyric = array();
            if(count($row) >2){
                if(end($row) != ']'){
                    $col_text = end($row);
                    $row = array_slice($row,0,1);
                }else{
                    $col_text = $row[1] . ']';
                    $row = array_slice($row,0,1);
                }
            }else{
                $col_text = end($row);
                array_pop($row);
            }
            foreach ($row as $key) {
                if($col_text != ' ' && $col_text != '' ){
                    $time = explode(":", substr($key, 1));
                    $time = $time[0] * 60 + $time[1];
                    if(isset($play_info["lrc"][$time])){
                        $play_info["lrc"][$time] .= "(" . $col_text . ")";
                    }
                }
            }
        }
    }
}
echo json_encode($play_info);