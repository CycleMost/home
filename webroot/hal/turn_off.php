<?PHP

require_once('./plum/plum_lightpad_functions.php');

echo "<pre>";

turn_off_light($lightpad_config);

echo "</pre>";

function turn_off_light($lightpad_config) {
	foreach($lightpad_config as $lightpad_id => $lightpad_data)
	{
        $lightpad_information = lightpad_information($lightpad_id); 
        echo "Turning Off Light: ".$lightpad_information['house_name']." - ".$lightpad_information['room_name']." - ".$lightpad_information['logical_load_name']."\n";
        lightpad_off($lightpad_id);
    }
}

?>