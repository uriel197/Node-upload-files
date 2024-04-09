const url = "/api/v1/products";
const fileFormDOM = document.querySelector(".file-form");

const nameInputDOM = document.querySelector("#name");
const priceInputDOM = document.querySelector("#price");
const imageInputDOM = document.querySelector("#image");

const containerDOM = document.querySelector(".container");
let imageValue;

imageInputDOM.addEventListener("change", async (e) => {
  const imageFile = e.target.files[0]; /* 1 */
  const formData = new FormData();
  formData.append("image", imageFile); /* 2 */

  try {
    const response = await fetch(`${url}/uploads`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Failed to upload image");

    const data = await response.json();
    console.log(data);
    /* image: {src: 'https://res.cloudinary.com/daagiqtdq/image/upload/…227037/file-upload/tmp-1-1712227036322_kkgjjz.jpg'}
     */
    imageValue = data.image.src;
  } catch (error) {
    imageValue = null;
    console.log(error);
  }
});

fileFormDOM.addEventListener("submit", async (e) => {
  e.preventDefault();
  const nameValue = nameInputDOM.value;
  const priceValue = priceInputDOM.value;

  try {
    const product = { name: nameValue, price: priceValue, image: imageValue };

    const response = await fetch(url, {
      /* 3 */ method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });

    if (!response.ok) {
      throw new Error("Failed to add product");
    }

    fetchProducts();
  } catch (error) {
    console.log(error);
  }
});

async function fetchProducts() {
  try {
    const response = await fetch(url);

    if (!response.ok) throw new Error("Failed to fetch products");

    const responseData = await response.json();

    const { product } = responseData;
    if (!product || !Array.isArray(product))
      throw new Error("Invalid response format");

    const productsDOM = product
      .map((item) => {
        return `<article class="product">
          <img src="${item.image}" alt="${item.name}" class="img"/>
          <footer>
            <p>${item.name}</p>
            <span>$${item.price}</span>
          </footer>
        </article>`;
      })
      .join("");

    containerDOM.innerHTML = productsDOM;
  } catch (error) {
    console.log(error);
  }
}

fetchProducts();

/***************** COMMENTS ***************

***Note: "change" this event listener is attached to an input element with the id imageInputDOM, listening for the 'change' event. When a user selects an image file using the input element, this event is triggered.

***1: In HTML, an <input> element with the type="file" attribute allows users to select one or multiple files from their device. When a user selects one or more files using this input element, those files are stored in the files property of the input element.

Since this input element can accept multiple files (if multiple attribute is present), the files property is an array-like object containing all selected files.

However, if you only want to handle one file (the first one selected), you can access it using the index [0]. This ensures that even if the input allows multiple files to be selected, your code only handles the first one.

***2: FormData is a built-in JavaScript object that allows you to easily construct a set of key/value pairs representing form fields and their values. It's commonly used when working with forms, especially when you need to send form data via AJAX requests.
When you create a new FormData object as shown in your code, you're initializing an empty FormData instance. You can then use methods like append() to add key/value pairs to this form data object.
If you append a file named "WhatsApp Image 2023-05-08 at 3.43.25 PM.jpeg" to the FormData object using formData.append('image', imageFile), the FormData object would contain a single key-value pair where the key is "image" and the value is the file itself.
When you log the FormData object, you won't see the actual content of the file, but rather you'll see something like:

FormData {
  "image": [File]
}

Here, [File] represents the file object itself. It won't display the file name as you specified, but you can access the file's properties and methods using the FormData object.
To access the file name, you would typically use FormData.get('image').name, which would return "WhatsApp Image 2023-05-08 at 3.43.25 PM.jpeg".

***3: If you make a fetch request without specifying any options, such as method, headers, or body, the request will default to a GET request. This means that the fetch will simply retrieve the resource specified by the URL (url in your case) using the GET method.
In our example:

try {
    const response = await fetch(url);
}

This code will send a GET request to the url. It won't include any headers or body data. It will simply retrieve whatever resource is located at that URL. If you were expecting to send data to the server, this would not happen with this fetch request as it lacks the necessary options to include data.

Therefore,  If you're making a simple GET request, you don't need to include any additional options such as custom headers or a request body, you can simply call fetch with just the URL as the argument.

********************************************************

//  CODE WITH AXIOS:

// const url = "/api/v1/products";
// const fileFormDOM = document.querySelector(".file-form");

// const nameInputDOM = document.querySelector("#name");
// const priceInputDOM = document.querySelector("#price");
// const imageInputDOM = document.querySelector("#image");

// const containerDOM = document.querySelector(".container");
// let imageValue;

// imageInputDOM.addEventListener("change", async (e) => {
//   const imageFile = e.target.files[0]; 
//   const formData = new FormData();
//   formData.append("image", imageFile); 
//   try {
//     const {
//       data: {
//         image: { src }, /* 1 */
//       },
//     } = await axios.post(`${url}/uploads`, formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });

//     imageValue = src;
//   } catch (error) {
//     imageValue = null;
//     console.log(error);
//   }
// });

// fileFormDOM.addEventListener("submit", async (e) => {
//   e.preventDefault();
//   const nameValue = nameInputDOM.value;
//   const priceValue = priceInputDOM.value;
//   try {
//     const product = { name: nameValue, price: priceValue, image: imageValue };

//     await axios.post(url, product);
//     fetchProducts();
//   } catch (error) {
//     console.log(error);
//   }
// });

// async function fetchProducts() {
//   try {
//     const {
//       data: { products },
//     } = await axios.get(url);

//     const productsDOM = products
//       .map((product) => {
//         return `<article class="product">
// <img src="${product.image}" alt="${product.name}" class="img"/>
// <footer>
// <p>${product.name}</p>
// <span>$${product.price}</span>
// </footer>
// </article>`;
//       })
//       .join("");
//     containerDOM.innerHTML = productsDOM;
//   } catch (error) {
//     console.log(error);
//   }
// }

// fetchProducts();

/**************** COMMENTS ***************


***1: {data:{image:{src}}}: Destructuring is used here to extract the src property from the response data. This assumes that the server responds with a nested object structure where the URL of the uploaded image is nested under data.image.src.

responseData is the entire response object. mainly:

await axios.post(`${url}/uploads`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

responseData.data accesses the data property of responseData.
responseData.data.image accesses the image property of responseData.data.
responseData.data.image.src accesses the src property of responseData.data.image.
Finally, by using destructuring, we're extracting the value of src and assigning it to the variable src {src}.
So, src will hold the value of responseData.data.image.src.

*/
