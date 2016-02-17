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

function get_music_info($music_id)
{
    $url = "http://music.163.com/api/song/detail/?id=" . $music_id . "&ids=%5B" . $music_id . "%5D";
    return curl_get($url);
}

function get_music_lyric($music_id)
{
    $url = "http://music.163.com/api/song/lyric?os=pc&id=" . $music_id . "&lv=-1&kv=-1&tv=-1";
    return curl_get($url);
}

function rand_music_id()
{
    global $play_list;
    $sum = count($play_list);
    $id = $play_list[rand(0, $sum - 1)]["id"];
    return $id;
}

function get_music_id()
{
    $id = rand_music_id();
    return $id;
}

function get_playlist_info($playlist_id)
{
    $url = "http://music.163.com/api/playlist/detail?id=" . $playlist_id;
    return curl_get($url);
}

$json = get_playlist_info($playlist);
$arr = json_decode($json, true);
$play_list = $arr["result"]["tracks"];
//获取数据

if($_REQUEST['id']){
    $id = $_REQUEST['id'];
}else{
    $id = get_music_id();
}

$music_info = json_decode(get_music_info($id), true);
$lrc_info = json_decode(get_music_lyric($id), true);
//处理音乐信息
$play_info["cover"] = $music_info["songs"][0]["album"]["picUrl"];
$play_info["mp3"] = $music_info["songs"][0]["mp3Url"];
$play_info["mp3"] = str_replace("http://m", "http://p", $play_info["mp3"]);
$play_info["music_name"] = $music_info["songs"][0]["name"];
$play_info["album_name"] = $music_info["songs"][0]["album"]["name"];
$play_info["id"] = $id;
$play_info["tracks"] = $play_list;
foreach ($music_info["songs"][0]["artists"] as $key) {
    if (!isset($play_info["artists"])) {
        $play_info["artists"] = $key["name"];
    } else {
        $play_info["artists"] .= "," . $key["name"];
    }
}

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
                $col_text = $row[1] . ']';
                $row = array_slice($row,0,1);
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
echo json_encode($play_info);