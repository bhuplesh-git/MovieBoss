const setupTextarea = document.getElementById('setup-textarea') 
const setupInputContainer = document.getElementById('setup-input-container')
const movieBossText = document.getElementById('movie-boss-text')

document.getElementById("send-btn").addEventListener("click", () => {
  console.log("clicked")
   if (setupTextarea.value) {
     setupInputContainer.innerHTML = `<img src="images/loading.svg" class="loading" id="loading">`
     movieBossText.innerText = `Ok, just wait a second while my digital brain digests that...`
     fetchBotResponse(setupTextarea.value)
    fetchSynopsis(setupTextarea.value)
    }
})

async function fetchBotResponse(inputText) {
  const prompt = `Generate a short message to enthusiastically say the movie idea that 
  sounds interesting and that you need few minutes to think about it. 
  Mention one aspect of the sentence.
  ###
  idea: Two lovers went to moon for their honeymoon
  message: Wow, I could never imagine going to moon for my honeymoon. Thats the crazies thing I have ever heard.
  ###
  idea: The hero turns out to be a villain
  message: What!! how can the hero be a villain? That sounds so interesting. I must watch this movie.
  ###
  idea: ${inputText}
  message:
  `;
  const max_tokens = 50;
  const response = await fetchResponse(prompt, max_tokens)
  movieBossText.innerText = response.choices[0].text.trim()
}

async function fetchSynopsis(inputText) {
  const prompt = `Generate a engaging, professional, and marketable synopsis for the movie idea.
  The synopsis should include actors names in brackets after each character. Choose actors that would be ideal for this role.
  ###
  idea: Air Force Pilot steals two nuclear weapons. His partner is on mission to stop him.
  message: Air Force pilots Vic Deakins (John Travolta) and Riley Hale (Christian Slater) are sent on an overnight top-secret mission with two nuclear weapons aboard their aircraft. 
  But, after they are in the air, Deakins changes the plan. He attempts to kill Hale and then steals the weapons with the intent of selling them to terrorists. 
  However, Hale survives the crash and meets up with park ranger Terry Carmichael (Samantha Mathis). 
  Together, Hale and Terry attempt to thwart Deakins' plan.
  ###
  idea: Love story on the ship, which is about to sink. Will it meet its fate
  message: After winning a trip on the RMS Titanic during a dockside card game, American Jack Dawson(Leonardo DiCaprio) 
  spots the society girl Rose DeWitt Bukater(Kate Winslet) who is on her way to Philadelphia to marry her rich snob 
  fiancé Caledon Hockley(Billy Zane). Rose feels helplessly trapped by her situation and makes her way to the aft deck and 
  thinks of suicide until she is rescued by Jack. Cal is therefore obliged to invite Jack to dine at their first-class 
  table where he suffers through the slights of his snobbish hosts. In return, he spirits Rose off to third-class for an e
  vening of dancing, giving her the time of her life. Deciding to forsake her intended future all together, Rose asks Jack, 
  who has made his living making sketches on the streets of Paris, to draw her in the nude wearing the invaluable blue diamond 
  Cal has given her. Cal finds out and has Jack locked away. Soon afterwards, the ship hits an iceberg and Rose must find Jack while 
  both must run from Cal even as the ship sinks deeper into the freezing water.
  ###
  idea: ${inputText}
  message:
  `;
  const max_tokens = 500;
  const response = await fetchResponse(prompt, max_tokens)
  const synopsis = response.choices[0].text.trim()
  document.getElementById('output-text').innerText = synopsis
  fetchTitle(synopsis)
  fetchStars(synopsis)
}

async function fetchTitle(synopsis) {
  const prompt = `Generate a catch title for the movie synopsis: "${synopsis} in less than 6 words".`;
  const max_tokens = 25;
  const response = await fetchResponse(prompt, max_tokens)
  const title = response.choices[0].text.trim()
  document.getElementById('output-title').innerText = title
  fetchPicturePrompt(title, synopsis)
}

async function fetchStars(synopsis) {
  const prompt = `Extract the names in brackets from the synopsis.: "${synopsis}".`;
  const max_tokens = 50;
  const response = await fetchResponse(prompt, max_tokens)
  document.getElementById('output-stars').innerText = response.choices[0].text.trim()
}

async function fetchPicturePrompt(title, synopsis) {
  const prompt = `Give a short description of an image which could be used to advertise a movie based on a title and synopsis. 
  The description should be rich in visual detail but contain no names.
  ###
  title: Love story on the ship, which is about to sink. Will it meet its fate
  synopsis: After winning a trip on the RMS Titanic during a dockside card game, American Jack Dawson(Leonardo DiCaprio) 
  spots the society girl Rose DeWitt Bukater(Kate Winslet) who is on her way to Philadelphia to marry her rich snob 
  fiancé Caledon Hockley(Billy Zane). Rose feels helplessly trapped by her situation and makes her way to the aft deck and 
  thinks of suicide until she is rescued by Jack. Cal is therefore obliged to invite Jack to dine at their first-class 
  table where he suffers through the slights of his snobbish hosts. In return, he spirits Rose off to third-class for an e
  vening of dancing, giving her the time of her life. Deciding to forsake her intended future all together, Rose asks Jack, 
  who has made his living making sketches on the streets of Paris, to draw her in the nude wearing the invaluable blue diamond 
  Cal has given her. Cal finds out and has Jack locked away. Soon afterwards, the ship hits an iceberg and Rose must find Jack while 
  both must run from Cal even as the ship sinks deeper into the freezing water.
  image description: A loving couple in a romantic pose with a background of sinking ship. 
  ###
  title: ${title}
  synopsis: ${synopsis}
  image description:
  `;
  const max_tokens = 100;
  const temperature = 0.8
  const response = await fetchResponse(prompt, max_tokens, temperature)
  const imagePrompt = response.choices[0].text.trim()
  console.log(imagePrompt)
  fetchPicture(imagePrompt)
}

async function fetchPicture(imagePrompt) {
  const prompt = `${imagePrompt}`
  const response = await fetchImage(prompt)
  document.getElementById('output-img-container').innerHTML = `<img src="data:image/png;base64,${response.data[0].b64_json}">`
  setupInputContainer.innerHTML = `<button id="view-pitch-btn" class="view-pitch-btn">View Pitch</button>`
  document.getElementById('view-pitch-btn').addEventListener('click', ()=>{
  document.getElementById('setup-container').style.display = 'none'
  document.getElementById('output-container').style.display = 'flex'
  movieBossText.innerText = `This idea is so good I'm jealous! It's gonna make you rich for sure! Remember, I want 10% 💰`
  })
}



async function fetchResponse(prompt, max_tokens, temperature=1) {
  const url = "http://localhost:5000/getTextFromPrompt"
  const response = await fetch(url, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
  },
    body: JSON.stringify({
      prompt: prompt,
      max_tokens: max_tokens,
      temperature: temperature
    })
  })
  return response.json() 
}

async function fetchImage(prompt) {
  const url = "http://localhost:5000/getImageFromPrompt"
  const response = await fetch(url, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
  },
    body: JSON.stringify({
      prompt: prompt
    })
  })
  return response.json() 
}
