package es.ubu.inf.tfg.user.role.permission;

public enum Permission {
    
    // ----------- Role -----------
    ROLE_VIEW_LIST,
    ROLE_CREATE,
    ROLE_EDIT,
    ROLE_DELETE,


    // ----------- User -----------
    USER_VIEW_LIST,
    USER_CREATE,
    USER_EDIT_MYSELF,
    USER_EDIT_OTHERS,
    USER_EDIT_ROLES,
    USER_DELETE,


    // ----------- Food -----------
    FOOD_VIEW_LIST,
    FOOD_CREATE,
    FOOD_EDIT,
    FOOD_DELETE,


    // ----------- Product -----------
    PRODUCT_VIEW_LIST,
    PRODUCT_CREATE,
    PRODUCT_EDIT,
    PRODUCT_EDIT_INGREDIENTS,
    PRODUCT_DELETE,


    // ----------- DiningTable -----------
    TABLE_VIEW_LIST,
    TABLE_CREATE,
    TABLE_EDIT,
    TABLE_DELETE,


    // ----------- Reservation -----------
    RESERVATION_VIEW_LIST,
    RESERVATION_CREATE,
    RESERVATION_EDIT,
    RESERVATION_DELETE,


    // ----------- Order -----------
    ORDER_VIEW_LIST,
    ORDER_CREATE,
    ORDER_EDIT,
    ORDER_DELETE,

    // BarOrder
    ORDER_BAR_VIEW_LIST,
    ORDER_BAR_CREATE,
    ORDER_BAR_EDIT,
    ORDER_BAR_DELETE,

    // DiningOrder
    ORDER_DINING_VIEW_LIST,
    ORDER_DINING_CREATE,
    ORDER_DINING_EDIT,
    ORDER_DINING_DELETE
}
