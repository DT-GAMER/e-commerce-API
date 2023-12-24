# E-Commerce API 

This project encompasses a comprehensive E-commerce API developed using Express and MongoDB. It encapsulates all essential functionalities crucial for a robust E-commerce platform, providing seamless user experience and efficient management of various aspects of an online store.

# Key Functionalities

User Authentication:

    User Registration:
        Enables the creation of new user accounts.
    User Login:
        Functionality for registered users to log in securely.

Category Management:

    Addition of Categories:
        Capability to add new categories for products.
    Editing and Deletion:
        Ability to modify and remove existing categories.

Product Management:

    Product Addition, Editing, and Deletion:
        Facilitates the addition, modification, and removal of products from the inventory.
    Product Images:
        Supports the inclusion of product feature images for enhanced presentation.
        Incorporates multiple images for individual products.

Order Processing:

    Order Creation System:
        Seamless order creation mechanism allowing users to place orders efficiently.
    Order Management:
        Efficient management of order-related functionalities to streamline processing.

## Setup
 
```da
    $ git clone https://github.com/dinushchathurya/nodejs-ecommerce-api.git
    $ cd nodejs-ecommerce-api
    $ npm install
```
  - update the dabase.confi.js environment variables

  ### Run The Service
  ```
  $ nodemon app.js
  ```
## API Endpoints

## User Routes

### * Create User

`POST |  /api/v1/users/register` 

| Key       | Value              |
| --------- | -----------        |
| name      | Admin              |
| email     | admin@gmail.com    |
| password  | 12344556           |
| phone     | +2347046736484     |
| isAdmin   | true               |
| street    | Oke Aro Street     |
| apartment | Block C            |
| zip       | 112107             |
| city      | Ogun state         |
| country   | Nigeria            |

### * Login User

`POST |  /api/v1/users/login` 

| Key        | Value          |
| ---------  | -----------    |
| email      | admin@gmail.com|
| password   | 12344556       |

### * Get Users

`GET |  /api/v1/users` 

### * Get Single Users

`GET |  /api/v1/users/{id}` 

### * Delete User

`DELETE |  /api/v1/users/{id}` 

### * Get Users Count

`GET |  /api/v1/users/get/count` 

## Category Routes

### * Create Category

`POST |  /api/v1/categories` 

| Key   | Value      |
| ------| ---------- |
| name  | Category 1 |
| icon  | bag.png    |
| color | #55879     |

### * Get Categories

`GET |  /api/v1/categories` 

### * Get Single Category

`GET |  /api/v1/categories/{id}` 

### * Update Category

`PUT |  /api/v1/categories/{id}` 

| Key   | Value      |
| ------| ---------- |
| name  | Category 1 |
| icon  | bag.png    |
| color | #55879     |

### * Delete Category

`DELETE |  /api/v1/categories/{id}`

## Product Routes

### * Create Product

`POST |  /api/v1/products` 

| Key            | Value           |
| ---------      | -----------     |
| name           | Product 1       |
| Description    | Your Description|
| image          | image.png       |
| brand          | Brand 1         |
| price          | 10000           |
| category       | {category_id}   |
| countInStock   | 100             |
| rating         | 4.5             |
| numReviews     | 40              |
| isFeatured     | true            |

### * Get Products

`GET |  /api/v1/products` 

###  * Get Single Category

`GET |  /api/v1/products/{id}` 

###  * Get Prodcut Counts

`GET |  /api/v1/products/get/count` 

###  * Get Featured Prodcut Counts

`GET |  /api/v1/products/get/featured/{count}`

### * Upload Galley Images

`POST |  /api/v1/products/gallery-images/{id}`
| Key            | Value           |
| ---------      | -----------     |
| images         | Array of images |

### * Update Product

`PUT |  /api/v1/products` 
| Key            | Value           |
| ---------      | -----------     |
| name           | Product 1       |
| Description    | Your Description|
| image          | imag.png        |
| brand          | Brand 1         |
| price          | 10000           |
| category       | {category_id}   |
| countInStock   | 100             |
| rating         | 4.5             |
| numReviews     | 40              |
| isFeatured     | true            |

### * Delete Product

`DELETE |  /api/v1/products/{id}`

## Orders Routes

### * Create Order

`POST |  /api/v1/orders` 
```
{
	"orderItems":[
		{
			"quantity": 3,
			"product" : "602e9c348e700335d8532b14"
		},
			{
			"quantity": 2,
			"product" : "602bde0161fcc409fc149734"
		}
	],
	"shippingAddress1" : "No 45, oke-aro Street",
	"shippingAddress2" : "No 46, jejeleko Street",
	"city" : "Ogun State",
	"zip" : "112107",
	"country" : "Nigeria",
	"phone" : "+2347046578577",
	"user" : "602e9b718e700335d8532b13"
}
```
### * Get Orders

`GET |  /api/v1/orders` 

### * Get Single Order

`GET |  /api/v1/orders/{id}` 

### * Get Total Order Count

`GET |  /api/v1/orders/get/count`

### * Get Total Sales

`GET |  /api/v1/orders/get/totalsales`

### * Get User Order

`GET |  /api/v1/orders/get/usersorders/{userid}`

### * Update Single Order

`PUT |  /api/v1/orders/{id}` 

### * Delete Single Order

`DELETE |  /api/v1/orders/{id}` 

## Author
[Abakpa Dominic](https://DT-GAMER.github.io/)
