// http://api.weatherapi.com/v1/current.json?key=9188839f48df47c0ab652839250604 Current Weather&q=Mumbai&aqi=no


let targetLocation = 'Mumbai'

const fetchResults = async (targetLocation) => {
    let url = "http://api.weatherapi.com/v1/current.json?key=9188839f48df47c0ab652839250604&q=${targetLocation}&aqi=no";

    const res = await fetch(url)  
    const data = await res.json()   

    console.log(data)

    let locationName = data.location.name
    let time = data.location.localtime
    let temperature = data.current.temp_c
    let condition = data.current.condition.text
}

fetchResults(target)