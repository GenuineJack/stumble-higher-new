let resources = [];

// Function to fetch resource data from the external JSON file.
// The JSON file is expected to have a "Books" category.
function loadResources() {
  fetch('stumble-higher-resources-final-1.json')
    .then(response => response.json())
    .then(data => {
      console.log("Data loaded from JSON:", data);
      // Filter out header rows (e.g., rows with id "title" or starting with dashes).
      resources = data.Books.filter(item => item.id !== "title" && !item.id.startsWith("-"));
      console.log("Filtered resources:", resources);
      if (resources.length === 0) {
        console.error("No valid resources found.");
      } else {
        loadRandomResource();
      }
    })
    .catch(error => {
      console.error('Error loading resource data:', error);
    });
}

// Function to select a random resource from the resources array.
function getRandomResource() {
  if (resources.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * resources.length);
  return resources[randomIndex];
}

// Function to load a random resource into the iframe and update the footer.
let currentResource = null;
function loadRandomResource() {
  const resource = getRandomResource();
  if (resource) {
    // In this JSON, the resource URL is stored in the "author" field.
    document.getElementById('resource-iframe').src = resource.author;
    // Display the resource title (from "id") and the resource's author (from "title").
    document.getElementById('resource-info').textContent = `${resource.id} by ${resource.title}`;
    currentResource = resource;
    console.log("Loaded resource:", resource);
  } else {
    console.error("No resource to load.");
  }
}

// Set up event listeners once the DOM is loaded.
document.addEventListener('DOMContentLoaded', () => {
  loadResources();

  // "Go Higher" button loads a new random resource.
  document.getElementById('new-resource-btn').addEventListener('click', loadRandomResource);

  // "Open in New Tab" button opens the current resource URL in a new tab.
  document.getElementById('open-tab-btn').addEventListener('click', () => {
    if (currentResource && currentResource.author) {
      window.open(currentResource.author, '_blank');
    }
  });

  // "Share" button uses the Web Share API (with a fallback alert).
  document.getElementById('share-btn').addEventListener('click', () => {
    if (navigator.share && currentResource) {
      navigator.share({
        title: currentResource.id,
        text: `Check out "${currentResource.id}" by ${currentResource.title} on Stumble Higher!`,
        url: currentResource.author
      }).catch(error => console.error('Error sharing:', error));
    } else {
      alert('Sharing is not supported on your browser. Please copy the URL: ' + currentResource.author);
    }
  });
});
