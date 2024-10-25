// class Review {
//   constructor(name, comment, rating, image) {
//     this.name = name;
//     this.comment = comment,
//     this.rating = rating,
//     this.image = image
//   }
// }

// const testimoni = [
//     new Review("Anyname", "Sangat Menarik", 5, "IMG_0807.JPG"),
//     new Review("Noname", "Keren Sekali", 4, "IMG_0809.JPG"),
//     new Review("Tehehe", "Tidak Menarik", 3, "IMG_0808.JPG"),
//     new Review("Tehehe", "Tidak Menarik", 3, "IMG_0808.JPG"),
//     new Review("Tehehe", "Tidak Menarik", 3, "IMG_0808.JPG")
// ];

async function displayRating(x) {
  try{
    const testimoni = await fetch("https://api.npoint.io/9903d9094c66d7c5b12f");
    const review = await testimoni.json();
    const testimoniRating = review.filter((review) => {
      return review.rating === x;
    });
    let content = [];
    testimoniRating.forEach((x) => {
      content.push(`<div class="card">
        <img class="card-img-top" src="./assets/${x.image}" />
        <div class="card-body">
          <h2 class="poppins-bold card-title">${x.rating}/5 | ${x.comment}</h2>
          <h4 class="poppins-medium">${x.nama}</h4>
        </div>
      </div>`);
    });
    document.getElementById("content").innerHTML = content
  } catch{
    document.getElementById("content").innerHTML = "<h1>Kosong</h1>"
  }
  
  
}

async function displayReview() {
  try {
    const testimoni = await fetch("https://api.npoint.io/9903d9094c66d7c5b12f");
    const review = await testimoni.json();

    let content = [];
    review.forEach((x) => {
      content.push(`<div class="card">
        <img class="card-img-top" src="./assets/${x.image}" />
        <div class="card-body">
          <h3 class="poppins-bold card-title">${x.rating}/5 | ${x.comment}</h3>
          <h6 class="poppins-medium">${x.nama}</h6>
        </div>
      </div>`);
      document.getElementById("content").innerHTML = content;
    });
  } catch {
    console.error(error);
  }
}

displayReview();
