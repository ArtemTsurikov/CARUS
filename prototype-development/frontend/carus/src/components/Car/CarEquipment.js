import CarCrashIcon from "@mui/icons-material/CarCrash";
import SpeedIcon from "@mui/icons-material/Speed";
import WbTwilightIcon from "@mui/icons-material/WbTwilight";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import FlightClassIcon from "@mui/icons-material/FlightClass";
import NotificationImportantIcon from "@mui/icons-material/NotificationImportant";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import TungstenIcon from "@mui/icons-material/Tungsten";
import AndroidIcon from "@mui/icons-material/Android";
import AppleIcon from "@mui/icons-material/Apple";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import BluetoothIcon from "@mui/icons-material/Bluetooth";
import LockIcon from "@mui/icons-material/Lock";
import MinorCrashIcon from "@mui/icons-material/MinorCrash";
import HeatPumpIcon from "@mui/icons-material/HeatPump";
import TrafficIcon from "@mui/icons-material/Traffic";
import RadioIcon from "@mui/icons-material/Radio";
import SevereColdIcon from "@mui/icons-material/SevereCold";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import TypeSpecimenIcon from "@mui/icons-material/TypeSpecimen";
import GppBadIcon from "@mui/icons-material/GppBad";
import CastConnectedIcon from "@mui/icons-material/CastConnected";
import SolarPowerIcon from "@mui/icons-material/SolarPower";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import AttractionsIcon from "@mui/icons-material/Attractions";
import LandscapeIcon from "@mui/icons-material/Landscape";
import KeyOffIcon from "@mui/icons-material/KeyOff";
import AddRoadIcon from "@mui/icons-material/AddRoad";
import FlareIcon from "@mui/icons-material/Flare";
import WeekendIcon from "@mui/icons-material/Weekend";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import VideogameAssetIcon from "@mui/icons-material/VideogameAsset";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import KayakingIcon from "@mui/icons-material/Kayaking";
import PanoramaIcon from "@mui/icons-material/Panorama";
import SensorsIcon from "@mui/icons-material/Sensors";
import CarRepairIcon from "@mui/icons-material/CarRepair";
import SpeakerIcon from "@mui/icons-material/Speaker";
import ThunderstormIcon from "@mui/icons-material/Thunderstorm";
import PartyModeIcon from "@mui/icons-material/PartyMode";
import SettingsRemoteIcon from "@mui/icons-material/SettingsRemote";
import LuggageIcon from "@mui/icons-material/Luggage";
import SatelliteAltIcon from "@mui/icons-material/SatelliteAlt";
import TireRepairIcon from "@mui/icons-material/TireRepair";
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness";
import AirlineSeatReclineNormalIcon from "@mui/icons-material/AirlineSeatReclineNormal";
import TouchAppIcon from "@mui/icons-material/TouchApp";
import GamepadIcon from "@mui/icons-material/Gamepad";
import RvHookupIcon from "@mui/icons-material/RvHookup";
import UsbIcon from "@mui/icons-material/Usb";
import HvacIcon from "@mui/icons-material/Hvac";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import WifiIcon from "@mui/icons-material/Wifi";
import BatteryChargingFullIcon from "@mui/icons-material/BatteryChargingFull";

import { Box, Typography, Grid } from "@mui/material";

const subject = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
};

const icon = {
  fontSize: 30,
  height: 30,
  my: 2,
  color: "primary.main",
  fontWeight: "bold",
};

const iconBox = {};

const iconMap = new Map([
  ["ABS", <CarCrashIcon sx={icon} />],
  ["Adaptive Headlights", <WbTwilightIcon sx={icon} />],
  ["Air Conditioning", <AcUnitIcon sx={icon} />],
  ["Airbags", <FlightClassIcon sx={icon} />],
  ["Alarm System", <NotificationImportantIcon sx={icon} />],
  ["All-Wheel Drive", <Brightness7Icon sx={icon} />],
  ["Ambient Lighting", <TungstenIcon sx={icon} />],
  ["Android Auto", <AndroidIcon sx={icon} />],
  ["Apple CarPlay", <AppleIcon sx={icon} />],
  ["Automatic Parking", <LocalParkingIcon sx={icon} />],
  ["Blind Spot Monitor", <VisibilityOffIcon sx={icon} />],
  ["Bluetooth", <BluetoothIcon sx={icon} />],
  ["Central Lock", <LockIcon sx={icon} />],
  ["Collision Avoidance System", <MinorCrashIcon sx={icon} />],
  ["Cooled Seats", <HvacIcon sx={icon} />],
  ["Cross Traffic Alert", <TrafficIcon sx={icon} />],
  ["Cruise Control", <SpeedIcon sx={icon} />],
  ["DAB Radio", <RadioIcon sx={icon} />],
  ["Dual Zone Climate Control", <SevereColdIcon sx={icon} />],
  ["Electric Mirrors", <ScreenShareIcon sx={icon} />],
  ["Electric Seats", <ElectricBoltIcon sx={icon} />],
  ["Electric Windows", <TypeSpecimenIcon sx={icon} />],
  ["Electronic Stability Program (ESP)", <CarCrashIcon sx={icon} />],
  ["Emergency Brake Assist", <GppBadIcon sx={icon} />],
  ["Head-Up Display", <CastConnectedIcon sx={icon} />],
  ["Heated Mirrors", <SolarPowerIcon sx={icon} />],
  ["Heated Seats", <LocalFireDepartmentIcon sx={icon} />],
  ["Heated Steering Wheel", <AttractionsIcon sx={icon} />],
  ["Hill Start Assist", <LandscapeIcon sx={icon} />],
  ["Keyless Entry", <KeyOffIcon sx={icon} />],
  ["Lane Keep Assist", <AddRoadIcon sx={icon} />],
  ["Leather Interior", <WeekendIcon sx={icon} />],
  ["LED Headlights", <FlareIcon sx={icon} />],
  ["Massage Seats", <WeekendIcon sx={icon} />],
  ["Memory Seats", <EventSeatIcon sx={icon} />],
  ["Multi-Function Steering Wheel", <VideogameAssetIcon sx={icon} />],
  ["Navigation System", <LocationOnIcon sx={icon} />],
  ["Paddle Shift", <KayakingIcon sx={icon} />],
  ["Panoramic Roof", <PanoramaIcon sx={icon} />],
  ["Parking Sensors", <SensorsIcon sx={icon} />],
  ["Power Liftgate", <CarRepairIcon sx={icon} />],
  ["Premium Audio System", <SpeakerIcon sx={icon} />],
  ["Rain Sensing Wipers", <ThunderstormIcon sx={icon} />],
  ["Rear View Camera", <PartyModeIcon sx={icon} />],
  ["Rear Window Defroster", <SevereColdIcon sx={icon} />],
  ["Remote Start", <SettingsRemoteIcon sx={icon} />],
  ["Roof Rack", <LuggageIcon sx={icon} />],
  ["Satellite Radio", <SatelliteAltIcon sx={icon} />],
  ["Spare Tyre", <TireRepairIcon sx={icon} />],
  ["Sunroof", <SettingsBrightnessIcon sx={icon} />],
  ["Third Row Seats", <AirlineSeatReclineNormalIcon sx={icon} />],
  ["Tire Pressure Monitoring System", <TireRepairIcon sx={icon} />],
  ["Touchscreen Display", <TouchAppIcon sx={icon} />],
  ["Traction Control", <GamepadIcon sx={icon} />],
  ["Trailer Coupling", <RvHookupIcon sx={icon} />],
  ["USB Ports", <UsbIcon sx={icon} />],
  ["Ventilated Seats", <HeatPumpIcon sx={icon} />],
  ["Voice Recognition", <RecordVoiceOverIcon sx={icon} />],
  ["Wi-Fi Hotspot", <WifiIcon sx={icon} />],
  ["Wireless Charging", <BatteryChargingFullIcon sx={icon} />],
]);

function EquipmentList(props) {
  const items = props.equipment;

  return (
    <Grid
      container
      sx={{
        display: "flex",
        justifyContent: "center",
        justifyItems: "space-evenly",
      }}
      columns={20}
    >
      {items.map((item) => equipmentItem(item))}
    </Grid>
  );
}
function equipmentItem(item) {
  return (
    <Grid item xs={5}>
      <Box sx={subject}>
        <Box sx={iconBox}>{iconMap.get(item)}</Box>
        <Typography variant="h5" align="center">
          {item}
        </Typography>
      </Box>
    </Grid>
  );
}

export default EquipmentList;

/**
export const CAR_EQUIPMENT = {
    ABS: 'ABS',-> CarCrashIcon, -> SpeedIcon
    ADAPTIVE_HEADLIGHTS: 'Adaptive Headlights', -> WbTwilightIcon
    AIR_CONDITIONING: 'Air Conditioning', -> AcUnitIcon
    AIRBAGS: 'Airbags', -> FlightClassIcon
    ALARM_SYSTEM: 'Alarm System', -> NotificationImportantIcon
    ALL_WHEEL_DRIVE: 'All-Wheel Drive', -> Brightness7Icon
    AMBIENT_LIGHTING: 'Ambient Lighting', -> TungstenIcon
    ANDROID_AUTO: 'Android Auto', -> AndroidIcon
    APPLE_CARPLAY: 'Apple CarPlay', -> AppleIcon
    AUTOMATIC_PARKING: 'Automatic Parking', -> LocalParkingIcon
    BLIND_SPOT_MONITOR: 'Blind Spot Monitor',   -> VisibilityOffIcon
    BLUETOOTH: 'Bluetooth', -> BluetoothIcon
    CENTRAL_LOCK: 'Central Lock', -> LockIcon
    COLLISION_AVOIDANCE_SYSTEM: 'Collision Avoidance System', -> MinorCrashIcon
    COOLED_SEATS: 'Cooled Seats', -> HvacIcon
    CROSS_TRAFFIC_ALERT: 'Cross Traffic Alert', -> TrafficIcon
    CRUISE_CONTROL: 'Cruise Control',  -> SpeedIcon
    DAB_RADIO: 'DAB Radio', -> RadioIcon
    DUAL_ZONE_CLIMATE_CONTROL: 'Dual Zone Climate Control', -> SevereColdIcon
    ELECTRIC_MIRRORS: 'Electric Mirrors', -> ScreenShareIcon
    ELECTRIC_SEATS: 'Electric Seats', -> ElectricBoltIcon
    ELECTRIC_WINDOWS: 'Electric Windows', -> TypeSpecimenIcon
    ELECTRONIC_STABILITY_PROGRAM: 'Electronic Stability Program (ESP)', -> CarCrashIcon
    EMERGENCY_BRAKE_ASSIST: 'Emergency Brake Assist', -> GppBadIcon
    HEAD_UP_DISPLAY: 'Head-Up Display', -> CastConnectedIcon
    HEATED_MIRRORS: 'Heated Mirrors', -> SolarPowerIcon
    HEATED_SEATS: 'Heated Seats', -> LocalFireDepartmentIcon
    HEATED_STEERING_WHEEL: 'Heated Steering Wheel', -> AttractionsIcon
    HILL_START_ASSIST: 'Hill Start Assist', -> LandscapeIcon
    KEYLESS_ENTRY: 'Keyless Entry', -> KeyOffIcon
    LANE_KEEP_ASSIST: 'Lane Keep Assist', -> AddRoadIcon
    LEATHER_INTERIOR: 'Leather Interior', -> ChairIcon
    LED_HEADLIGHTS: 'LED Headlights', -> FlareIcon
    MASSAGE_SEATS: 'Massage Seats', -> WeekendIcon
    MEMORY_SEATS: 'Memory Seats', -> EventSeatIcon
    MULTI_FUNCTION_STEERING_WHEEL: 'Multi-Function Steering Wheel', -> VideogameAssetIcon
    NAVIGATION_SYSTEM: 'Navigation System', -> LocationOnIcon
    PADDLE_SHIFT: 'Paddle Shift', -> KayakingIcon
    PANORAMIC_ROOF: 'Panoramic Roof', -> PanoramaIcon
    PARKING_SENSORS: 'Parking Sensors', -> SensorsIcon
    POWER_LIFTGATE: 'Power Liftgate', -> CarRepairIcon
    PREMIUM_AUDIO_SYSTEM: 'Premium Audio System', -> SpeakerIcon
    RAIN_SENSING_WIPERS: 'Rain Sensing Wipers', -> ThunderstormIcon
    REAR_VIEW_CAMERA: 'Rear View Camera', -> PartyModeIcon
    REAR_WINDOW_DEFROSTER: 'Rear Window Defroster', -> SevereColdIcon
    REMOTE_START: 'Remote Start', -> SettingsRemoteIcon
    ROOF_RACK: 'Roof Rack', -> LuggageIcon
    SATELLITE_RADIO: 'Satellite Radio', -> SatelliteAltIcon
    SPARE_TYRE: 'Spare Tyre', -> TireRepairIcon
    SUNROOF: 'Sunroof', -> SettingsBrightnessIcon
    THIRD_ROW_SEATS: 'Third Row Seats', -> AirlineSeatReclineNormalIcon
    TIRE_PRESSURE_MONITORING: 'Tire Pressure Monitoring System', TireRepairIcon
    TOUCHSCREEN_DISPLAY: 'Touchscreen Display', -> TouchAppIcon
    TRACTION_CONTROL: 'Traction Control', -> GamepadIcon
    TRAILER_COUPLING: 'Trailer Coupling', -> RvHookupIcon
    USB_PORTS: 'USB Ports', -> UsbIcon
    VENTILATED_SEATS: 'Ventilated Seats', -> HeatPumpIcon
    VOICE_RECOGNITION: 'Voice Recognition', -> RecordVoiceOverIcon
    WIFI_HOTSPOT: 'Wi-Fi Hotspot', -> WifiIcon
    WIRELESS_CHARGING: 'Wireless Charging' -> BatteryChargingFullIcon
  }
  */
