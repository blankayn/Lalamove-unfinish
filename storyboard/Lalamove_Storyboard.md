# Lalamove Storyboard

## 1. LOGIN PAGE
| Section | Details |
|---|---|
| Header / Branding | Lalamove logo centered on a clean card layout |
| Role Toggle | Customer / Driver switch |
| Form Fields | Email Address, Password |
| Actions | Log In button, Show/Hide Password |
| Extra Links | Forgot Password, Create a Free Account |
| Social Sign-in | Continue with Facebook, Continue with Google |
| Footer Links | Terms & Conditions, Privacy Notice |
| Description | The login page lets users choose a role and sign in to access customer or driver features. |

## 2. FORGOT PASSWORD PAGE
| Section | Details |
|---|---|
| Title | Reset Password |
| Instruction Text | Enter your email and receive a reset link |
| Form Fields | Email Address |
| Actions | Send Reset Link, Back to Login |
| Feedback | Success or error message after submission |
| Description | This page helps users recover access to their account by requesting a password reset link. |

## 3. CUSTOMER REGISTER PAGE
| Section | Details |
|---|---|
| Form Fields | Full Name, Email Address, Phone Number, Address, Password |
| Actions | Create Account, Log In |
| Validation | Required fields and registration response message |
| Role Context | Customer role selected from the role toggle |
| Description | The customer registration page collects personal and address information so a customer can create an account. |

## 4. DRIVER REGISTER PAGE
| Section | Details |
|---|---|
| Form Fields | Full Name, Email Address, Phone Number, Driver License Number, Plate Number, Vehicle Type, Password |
| Actions | Create Account, Log In |
| Vehicle Options | Motorcycle, Sedan, SUV/Minivan, Truck variations |
| Validation | Required fields and registration response message |
| Description | The driver registration page gathers driver identity and vehicle details needed for delivery service participation. |

## 5. CUSTOMER HOME / PLACE ORDER PAGE
| Section | Details |
|---|---|
| Top Navigation | Place Order, Records, Wallet, Drivers, Rewards, User Name, Log Out |
| Route Inputs | Pick-up Location, Drop-off Location |
| Map Interaction | Click map to place pickup and drop-off pins |
| Item Options | Small, Medium, Large, Fragile, Food, Documents |
| Extra Input | Item Description |
| Vehicle Selection | Motorcycle, Sedan, SUV, Minivan, Truck |
| Payment Options | Cash, GCash, Card |
| Pricing | Estimated Fee shown based on distance and vehicle type |
| Primary Action | Place Order |
| Description | This page is the main customer dashboard where users create a delivery request by entering route, item, vehicle, and payment details. |

## 6. MAP PIN AND ROUTE PREVIEW
| Section | Details |
|---|---|
| Map Area | Interactive Leaflet map with Cebu default center |
| Markers | Pickup marker, Drop-off marker, Driver marker |
| Route Display | Orange polyline between pickup and drop-off |
| Status Hint | Pickup step, Drop-off step, or Both Pins Set |
| Live Indicator | Driver En Route badge when an order is active |
| Description | The route preview area visually shows selected locations, the delivery path, and live order movement. |

## 7. CUSTOMER RECORDS PAGE
| Section | Details |
|---|---|
| Content | Delivery history list |
| Record Details | Order ID, Pickup, Drop-off, Item, Fee, Date, Status |
| Search / Filter | Search orders and browse past transactions |
| Actions | Track order, View status, Open rating flow for completed deliveries |
| Status Types | Pending, Ongoing, Completed, Cancelled |
| Description | The records page lets customers review previous and current deliveries together with order status and history details. |

## 8. ORDER TRACKING MODAL
| Section | Details |
|---|---|
| Title | Tracking Order #ID |
| Route Summary | Pickup location, Drop-off location, Assigned Driver |
| Map Features | Pickup marker, Drop-off marker, Moving driver marker, route line |
| Status | Driver is on the way |
| Action | Close modal |
| Description | The tracking modal gives customers a focused live view of delivery progress on a map. |

## 9. RATE DRIVER MODAL
| Section | Details |
|---|---|
| Title | Rate your driver |
| Input Controls | 1 to 5 star rating, optional comment box |
| Actions | Submit, Cancel |
| Feedback | Success message after rating submission |
| Description | The rating modal allows customers to leave a score and comment after a delivery is completed. |

## 10. WALLET PAGE
| Section | Details |
|---|---|
| Side Navigation | Transaction History, Coupons, Payment Methods |
| Summary Card | Total Spent |
| Transaction Fields | Type, Date, Order ID, Amount |
| Actions | Top Up, Add Payment Method |
| Empty States | No transactions or no coupons available |
| Description | The wallet page stores payment-related information, spending history, coupon area, and saved payment method details. |

## 11. DRIVERS PAGE
| Section | Details |
|---|---|
| Side Navigation | All Drivers, Favorites, Blocked |
| Search | Search drivers by name |
| Driver Card Info | Name, Status, Vehicle Type, Rating, Delivery Count, Completion Rate |
| Card Actions | Favorite, Block, View Profile |
| Display Logic | Shows assigned or available drivers from delivery history |
| Description | The drivers page helps customers manage preferred drivers and inspect delivery personnel details. |

## 12. DRIVER PROFILE MODAL
| Section | Details |
|---|---|
| Header | Driver name, avatar initials, availability badge |
| Stats | Average Rating, Deliveries, Completion Rate |
| Driver Info | Vehicle Type, Email, Phone |
| Reviews | Customer names, dates, ratings, comments |
| Action | Close modal |
| Description | The driver profile modal presents full driver details and customer review history in one view. |

## 13. REWARDS PAGE
| Section | Details |
|---|---|
| Header | Rewards |
| Summary | Total Points and Completed Deliveries |
| Rule | Earn 100 points per completed delivery |
| Tier Cards | Silver, Gold, Platinum |
| Visual Elements | Trophy icon and highlighted membership tier |
| Description | The rewards page tracks customer loyalty points earned from completed deliveries and shows membership tiers. |

## 14. DRIVER DASHBOARD - AVAILABLE ORDERS
| Section | Details |
|---|---|
| Top Navigation | Orders, My Deliveries, History, Ratings, Driver Name, Log Out |
| Status Badge | Available status shown in the header |
| Order Card Info | Order ID, Item, Pickup, Drop-off, Customer, Distance, Fee |
| Primary Action | Accept Order |
| Utility Action | Refresh |
| Description | This page shows pending customer bookings that drivers can review and accept. |

## 15. DRIVER DASHBOARD - MY DELIVERIES
| Section | Details |
|---|---|
| Content | Active deliveries accepted by the driver |
| Delivery Details | Pickup, Drop-off, Customer, Distance, Fee |
| Actions | Mark Completed, Cancel, Refresh |
| Status | Ongoing |
| Description | The My Deliveries page helps drivers manage the deliveries they are currently handling. |

## 16. DRIVER DASHBOARD - DELIVERY HISTORY
| Section | Details |
|---|---|
| Content | Completed deliveries list |
| History Details | Order ID, Date, Item, Route, Fee |
| Status | Completed |
| Embedded Feedback | Customer rating and comment per completed order when available |
| Description | The history page stores the driver's completed delivery records and any customer feedback attached to them. |

## 17. DRIVER DASHBOARD - RATINGS
| Section | Details |
|---|---|
| Summary Cards | Average Rating, Total Ratings, Comments Left |
| Review Entries | Order ID, Customer Name, Star Rating, Date, Comment |
| Action | Refresh |
| Description | The ratings page gives drivers a summary of customer reviews and individual comments from completed deliveries. |

## 18. STORYBOARD SUMMARY
| Section | Details |
|---|---|
| System Roles | Customer and Driver |
| Core Customer Flow | Log In -> Register -> Place Order -> Track -> Pay -> Review Driver |
| Core Driver Flow | Log In -> Accept Order -> Deliver -> Complete -> Receive Rating |
| Description | The storyboard covers both user roles and the full delivery process from account access to post-delivery feedback. |
