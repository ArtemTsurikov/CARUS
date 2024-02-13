import NodeGeocoder from 'node-geocoder';

const options = {
  provider: 'google',
  apiKey: 'AIzaSyCq0fQa9dKsuT9KiGe6MCLVVaSxWybAYqc',
  formatter: null,
};

const geocoder = NodeGeocoder(options);

export async function getGeoCode(address) {
    const res = await geocoder.geocode(`${address.street} ${address.houseNumber} ${address.ziCode} ${address.city} ${address.country}`);
    const location = [res[0].latitude, res[0].longitude];
    return location;
}