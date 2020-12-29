<?PHP

require_once('./plum/plum_lightpad_functions.php');

echo "<pre>";

$output = "";

// Headers
foreach (getallheaders() as $name => $value) {
  $output .= $name . ": " . $value . "\n";
}

turn_on_light($lightpad_config);

echo $output;
echo "</pre>";

function turn_on_light($lightpad_config) {
	foreach($lightpad_config as $lightpad_id => $lightpad_data)
	{
		$lightpad_information = lightpad_information($lightpad_id);
		echo "Turning On Light: ".$lightpad_information['house_name']." - ".$lightpad_information['room_name']." - ".$lightpad_information['logical_load_name']."\n";
		lightpad_on($lightpad_id);
	}
}

?>