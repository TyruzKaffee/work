let allMusic = [
	{
	  name: "Taylor Swift - Fortnight",
	  artist: "Taylor Swift (feat. Post Malone)",
	  img: "music-1",
	  src: "music-1"
	},
	{
	  name: "Disclosure - Latch",
	  artist: "Disclosure (feat. Sam Smith)",
	  img: "music-2",
	  src: "music-2"
	},
	{
	  name: "Halsey - Lilith",
	  artist: "Halsey, SUGA",
	  img: "music-3",
	  src: "music-3"
	},
	{
	  name: "Neffex - back one day",
	  artist: "TheFatRat & NEFFEX",
	  img: "music-4",
	  src: "music-4"
	},
	{
	  name: "NewJeans - Gods",
	  artist: "NewJeans",
	  img: "music-5",
	  src: "music-5"
	},
	{
	  name: "Jéja - On & On",
	  artist: "Cartoon, Jéja (feat. Daniel Levi)",
	  img: "music-6",
	  src: "music-6"
	}
  ];
  
  let audio = null;
  let audioActual = null;
  let volumenActual = 1;
  let pausa = false;
  let indiceActual = -1;
  let tiempo_inicial = "0:00";
  let tiempo_final = "0:00";
  
  // Función autoejecutable
  (function () {
	document.getElementById("volume").addEventListener("input", function () {
	  volumenActual = parseFloat(this.value);
	  ajustarVolumen(parseFloat(this.value));
	});
  
	document.getElementById("tiempo-inicial").textContent = tiempo_inicial;
	document.getElementById("tiempo-final").textContent = tiempo_final;
	cargarListaReproduccion();
  })();
  
  function cargarListaReproduccion() {
	var lista = document.getElementById("listaCanciones");
	allMusic.forEach((song, index) => {
	  var listItem = document.createElement("li");
	  var button = document.createElement("button");
	  button.setAttribute("type", "button");
  
	  button.textContent = song.name.substring(0, 40) + "...";
	  button.setAttribute("data-index", index); // Guardar el índice de la canción
	  button.addEventListener("click", function () {
		detenerReproduccion(); // Detener la reproducción actual
		reproducirCancionPorIndice(index); // Reproducir audio al hacer clic
		ajustarVolumen(volumenActual);
	  });
  
	  listItem.appendChild(button);
	  lista.appendChild(listItem);
	});
  }
  
  function detenerReproduccion() {
	if (audioActual) {
	  audioActual.pause();
	  audioActual.currentTime = 0;
	}
  }
  
  function reproducirAudio(src, name) {
	const nombreCancion = document.getElementById("music-name");
	nombreCancion.textContent = name.substring(0, 20) + "...";
	audioActual = new Audio(src);
	audioActual.play();
	pausa = true;
	pausaPlayReproduccion();
	indiceActual = allMusic.findIndex((song) => song.name === name);
  
	barraProgreso();
  
	validarFinalCancion();
  }
  
  function ajustarVolumen(valor) {
	const volumenRange = document.getElementById("volume");
	valor = volumenRange.value;
	if (audioActual) {
	  audioActual.volume = valor;
	}
  
	const volumen = document.getElementById("volume-status");
	if (valor == 0) {
	  volumen.src = "./public/svg/volume-mute.svg";
	} else if (valor > 0 && valor <= 0.5) {
	  volumen.src = "./public/svg/volume-min.svg";
	} else {
	  volumen.src = "./public/svg/volume-max.svg";
	}
  }
  
  function pausaPlayReproduccion() {
	const playPause = document.getElementById("play-pause");
	if (audioActual && !pausa) {
	  audioActual.pause();
	  pausa = true;
	  playPause.src = "./public/svg/play.svg";
	} else if (audioActual && pausa) {
	  audioActual.play();
	  pausa = false;
	  playPause.src = "./public/svg/pause.svg";
	}
  }
  
  function siguienteCancion() {
	if (indiceActual < allMusic.length - 1) {
	  // Verificamos que haya una siguiente canción en la lista
	  indiceActual++;
	  reproducirCancionPorIndice(indiceActual);
	} else {
	  indiceActual = 0;
	  reproducirCancionPorIndice(indiceActual);
	}
  }
  
  function cancionAnterior() {
	if (indiceActual > 0) {
	  indiceActual--;
	  reproducirCancionPorIndice(indiceActual);
	} else {
	  indiceActual = allMusic.length - 1;
	  reproducirCancionPorIndice(indiceActual);
	}
  }
  
  function muteVolumen() {
	const volumenRange = document.getElementById("volume");
  
	if (volumenActual == 0) {
	  volumenActual = 1;
	  ajustarVolumen(1);
	}
  
	if (volumenRange.value > 0) {
	  volumenRange.value = 0;
	  ajustarVolumen(0);
	} else {
	  volumenRange.value = volumenActual;
	  ajustarVolumen(volumenActual);
	}
  }
  
  function reproducirCancionPorIndice(indice) {
	detenerReproduccion(); // Detenemos la reproducción actual
	const song = allMusic[indice];
	reproducirAudio(`./public/audio/${song.src}.mp3`, song.name); // Reproducimos la canción correspondiente al índice
	ajustarVolumen(volumenActual);
  }

  function cargarImagen(src) {
	const musicImg = document.getElementById('music-img'); // Asegúrate de que 'music-img' sea el ID correcto de tu elemento de imagen
	musicImg.src = `./public/imagen/${src}.jpg`;
  }
  
  function validarFinalCancion() {
	audioActual.onended = function () {
	  siguienteCancion();
	};
  }
  
  function barraProgreso() {
	const progreso = document.getElementById("progreso");
	const barraProgreso = document.getElementById("barra-progreso");
  
	if (!audioActual) {
	  console.error("No se ha definido el elemento de audio.");
	  return;
	}
  
	// Actualizar el ancho de la barra de progreso durante la reproducción y los tiempos
	audioActual.ontimeupdate = function () {
	  const tiempoActual = audioActual.currentTime;
	  const tiempoFinal = audioActual.duration;
  
	  if (isNaN(tiempoActual) || isNaN(tiempoFinal)) {
		return;
	  }
  
	  // Actualizar el tiempo inicial y final de la canción
	  document.getElementById("tiempo-inicial").textContent = convertirTiempo(tiempoActual);
	  document.getElementById("tiempo-final").textContent = convertirTiempo(tiempoFinal);
  
	  // Actualizar el ancho de la barra de progreso
	  const porcentaje = (tiempoActual / tiempoFinal) * 100;
	  progreso.style.width = porcentaje + "%";
	};
  
	// Permitir al usuario moverse en la canción haciendo clic en la barra de progreso
	barraProgreso.addEventListener("click", function (e) {
	  const barraRect = barraProgreso.getBoundingClientRect();
	  const clickX = e.clientX - barraRect.left;
	  const barraAncho = barraRect.width;
	  const nuevoTiempo = (clickX / barraAncho) * audioActual.duration;
	  audioActual.currentTime = nuevoTiempo;
	});
  }
  
  function convertirTiempo(tiempo) {
	const minutos = Math.floor(tiempo / 60);
	let segundos = Math.floor(tiempo % 60);
	segundos = segundos < 10 ? "0" + segundos : segundos;
	return minutos + ":" + segundos;
  }
  
  // Sección menú de fondo
  document.querySelectorAll('.menu-selector').forEach(item => {
	item.addEventListener('click', toggleDropdown);
  });
  
  function toggleDropdown(event) {
	var dropdownMenu = document.getElementById("menudesplegable");
	dropdownMenu.style.display = (dropdownMenu.style.display === "block") ? "none" : "block";
	event.stopPropagation();
  }
  
  function changeBackgroundVideo(videoSrc) {
	var video = document.getElementById("video-background");
	video.src = videoSrc; 
	toggleDropdown(event); 
  }
  