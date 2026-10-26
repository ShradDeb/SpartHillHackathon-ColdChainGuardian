function nearestNetworkPharmacy(){return facilities.filter(f=>f.power&&f.available).map(f=>({...f,...communityRoute(finderArea,f.area)})).sort((a,b)=>a.minutes-b.minutes)[0]}
function networkPharmacyCard(){const p=nearestNetworkPharmacy();return `<div class="nearby-suggestions"><p class="eyebrow">WEBSITE PHARMACY NETWORK · SYNTHETIC DEMO</p><h3>${p?esc(p.name):'No powered pharmacy available'}</h3>${p?`<p class="subtitle">From ${esc(finderArea)} to ${esc(p.area)} · ${p.miles.toFixed(1)} miles · ${p.minutes} minutes assumed driving</p>`:''}<p class="footnote">Uses the pharmacies listed on this website and the selected demo service area. Distances, power and contact details are synthetic; cooling capacity and acceptance require confirmation.</p><button id="nearby-demo-chat">Ask Guardian AI for nearest pharmacy details</button></div>`}
// Google Maps is the active fallback while AWS organization policy blocks Amazon Location.
// Set this to 'amazon-location' only after geo-places:SearchNearby is allowed.
const nearbyProvider='google-maps';
const defaultPharmacyMap='https://www.google.com/maps/search/?api=1&query=pharmacy+near+me';
let nearbyState={loading:false,result:null,error:'',accuracy:null,mapsUrl:defaultPharmacyMap,located:false,locationLabel:'',draft:''};
function nearestLocationCard(){
 const d=nearbyState.result,p=d?.pharmacies?.[0];
 return `<section class="card nearest-real"><div class="sectiontop"><div><div class="eyebrow">YOUR CURRENT LOCATION</div><h2>Where do you need help?</h2></div><span class="pill ${nearbyState.located?'':'grey'}">${p?'Amazon Location':nearbyState.located?'Location ready':'Google Maps lookup'}</span></div>
 ${networkPharmacyCard()}
 <form id="nearby-location-form" class="nearby-location-form"><label class="fieldlabel" for="nearby-location-input">Enter your pharmacy address, city or ZIP code</label><div class="nearby-location-fields"><input id="nearby-location-input" name="location" type="text" maxlength="240" required autocomplete="off" placeholder="e.g. 200 Main Street, San Jose, CA" value="${esc(nearbyState.draft)}"><button type="submit" class="primary">Find nearby help</button></div></form>
 ${p?`<h3 class="nearby-name">${esc(p.name)}</h3><p class="subtitle">${esc(p.address)}</p><div class="number">${p.miles.toFixed(2)} <small>miles · straight-line distance</small></div><p class="footnote">Nearest of the mapped results found within ${d.radius_m/1000} km</p><a class="button primary" href="${esc(p.maps_url)}" target="_blank" rel="noopener noreferrer">Driving distance & time in Google Maps ↗</a><p class="inline-note">${esc(d.note)}</p>${d.bedrock?`<p class="subtitle">✧ ${esc(d.explanation)}</p><p class="footnote">Amazon Bedrock · ${esc(d.model)} · Request ${esc(d.requestId)}</p>`:`<p class="footnote">${esc(d.bedrock_note||'Mapped result; no Bedrock explanation generated.')}</p>`}`:
 `<div class="nearby-suggestions" aria-live="polite">${nearbyState.located?`<p class="eyebrow">SUGGESTED NEARBY HELP</p><h3>Contact a pharmacy near ${esc(nearbyState.accuracy!==null?'your current location':nearbyState.locationLabel)}</h3><p class="subtitle">Start with a nearby pharmacy that can confirm power and appropriate refrigerated storage for your medicines.</p><a class="button primary" href="${esc(nearbyState.mapsUrl)}" target="_blank" rel="noopener noreferrer">View nearby pharmacies & directions ↗</a><p class="subtitle nearby-alternative">If local pharmacies cannot help, contact a nearby hospital pharmacy.</p><a class="button" href="${esc('https://www.google.com/maps/search/?'+new URLSearchParams({api:'1',query:'hospital pharmacy near '+(nearbyState.locationLabel||'me')}))}" target="_blank" rel="noopener noreferrer">Find a hospital pharmacy ↗</a><p class="footnote">Google Maps shows location names, distances and driving times. Call first: confirm they can accept your medicines, have power and suitable cooling, and arrange a handover.</p><p class="footnote">No nearby cooling available? <a href="#response">See emergency options</a> or <a href="frostgate.html">open FrostGate ↗</a>.</p>`:'<p class="subtitle">Tell us your location above, or use your device location below, to find nearby pharmacies that may be able to help.</p>'}</div>`}

 ${nearbyState.accuracy!==null?`<p class="footnote">Browser location accuracy: approximately ${Math.round(nearbyState.accuracy||0)} m.</p>`:''}
 <div class="actions"><button id="nearby-locate" ${nearbyState.loading?'disabled':''}>${nearbyState.loading?'Getting your location…':nearbyState.located?'Refresh my location':'Use my current location'}</button>${nearbyState.located?'<button id="nearby-clear">Clear location</button>':''}</div>
 ${nearbyState.error?`<p class="error" role="alert">${esc(nearbyState.error)}</p>`:''}
 <p class="footnote">${nearbyProvider==='google-maps'?'Your entered location stays on this page until you open a search link; then it is shared with Google Maps. It is not saved or sent to Bedrock.':'Coordinates are sent to the local server and Amazon Location Service. Only public venue details are sent to Bedrock.'} Browser location determines where you are; Bedrock powers Guardian AI.</p></section>`;
}
function bindNearby(){
 document.querySelector('#nearby-demo-chat')?.addEventListener('click',()=>window.dispatchEvent(new Event('guardian-nearest-pharmacy')));
 document.querySelector('#nearby-location-input')?.addEventListener('input',event=>{nearbyState.draft=event.target.value});
 document.querySelector('#nearby-location-form')?.addEventListener('submit',event=>{
  event.preventDefault();
  const value=document.querySelector('#nearby-location-input').value.trim();
  if(!value||value.length>240){nearbyState.error='Enter an address, city or ZIP code.';render();return}
  nearbyState={...nearbyState,located:true,locationLabel:value,draft:value,accuracy:null,error:'',result:null,mapsUrl:'https://www.google.com/maps/search/?'+new URLSearchParams({api:'1',query:'pharmacy near '+value})};render();
 });
 document.querySelector('#nearby-locate')?.addEventListener('click',()=>{
  if(!navigator.geolocation){nearbyState.error='Location is not supported by this browser. Use the Google Maps search above.';render();return}
  nearbyState.loading=true;nearbyState.error='';render();
  navigator.geolocation.getCurrentPosition(async position=>{
   nearbyState.accuracy=position.coords.accuracy;nearbyState.located=true;nearbyState.result=null;nearbyState.draft='';nearbyState.locationLabel=`${position.coords.latitude},${position.coords.longitude}`;
   nearbyState.mapsUrl='https://www.google.com/maps/search/?'+new URLSearchParams({api:'1',query:`pharmacy near ${position.coords.latitude},${position.coords.longitude}`});
   try{
    if(nearbyProvider==='amazon-location'){
     const response=await fetch('/api/nearest',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({latitude:position.coords.latitude,longitude:position.coords.longitude})});
     const result=await response.json();if(!response.ok)throw Error(result.error||'Pharmacy lookup failed.');nearbyState.result=result;
    }
   }catch(e){nearbyState.error=e.message}finally{nearbyState.loading=false;render()}
  },error=>{nearbyState.loading=false;nearbyState.error=error.code===1?'Location permission was declined. Allow location in browser settings, or use Google Maps directly.':error.code===2?'Your location is unavailable. Check device location services or use Google Maps directly.':'Location request timed out. Please try again or use Google Maps directly.';render()},{enableHighAccuracy:false,timeout:15000,maximumAge:60000});
 });
 document.querySelector('#nearby-clear')?.addEventListener('click',()=>{nearbyState={loading:false,result:null,error:'',accuracy:null,mapsUrl:defaultPharmacyMap,located:false,locationLabel:'',draft:''};render()});
}
