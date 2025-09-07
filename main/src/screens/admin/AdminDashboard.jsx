import React from "react";
import AddRestaurantForm from "../../components/admin/AddRestaurantForm";

function AdminDashboard() {
  return (
    <div className="flex flex-col justify-center">
      AdminDashboard
      <div className="flex flex-row justify-evenly">
        <div>Col 1</div>
        <div>Col 2</div>
      </div>
      <AddRestaurantForm />
    </div>
  );
}

export default AdminDashboard;
