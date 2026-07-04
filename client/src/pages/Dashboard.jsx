import { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/Dashboard.css";

function Dashboard() {

  const [leads, setLeads] = useState([]);

  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    source: "Website",
    notes: "",
  });

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await API.get("/leads");
      setLeads(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const addLead = async (e) => {
    e.preventDefault();

    try {

      await API.post("/leads", form);

      setForm({
        name: "",
        email: "",
        phone: "",
        source: "Website",
        notes: "",
      });

      fetchLeads();

    } catch (err) {
      console.log(err);
    }
  };

  const changeStatus = async (id, status) => {

    try {

      await API.put(`/leads/${id}`, {
        status,
      });

      fetchLeads();

    } catch (err) {
      console.log(err);
    }

  };

  const deleteLead = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this lead?"
    );

    if (!confirmDelete) return;

    try {

      await API.delete(`/leads/${id}`);

      fetchLeads();

    } catch (err) {

      console.log(err);

    }

  };

  const filteredLeads = leads.filter((lead) =>
    lead.name.toLowerCase().includes(search.toLowerCase()) ||
    lead.email.toLowerCase().includes(search.toLowerCase())
  );

  const total = leads.length;

  const newLeads = leads.filter(
    (lead) => lead.status === "New"
  ).length;

  const contacted = leads.filter(
    (lead) => lead.status === "Contacted"
  ).length;

  const converted = leads.filter(
    (lead) => lead.status === "Converted"
  ).length;

  return (

    <div className="dashboard">

  <div className="header">
    <h1>LeadFlow CRM</h1>
    <p>Manage your client leads efficiently.</p>
  </div>

  <div className="cards">

    <div className="card">
      <h2>{total}</h2>
      <p>👥 Total Leads</p>
    </div>

    <div className="card">
      <h2>{newLeads}</h2>
      <p>🆕 New Leads</p>
    </div>

    <div className="card">
      <h2>{contacted}</h2>
      <p>📞 Contacted</p>
    </div>

    <div className="card">
      <h2>{converted}</h2>
      <p>✅ Converted</p>
    </div>

  </div>

  <div className="form-card">

    <h2>Add New Lead</h2>

    <form onSubmit={addLead}>

      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={form.name}
        onChange={handleChange}
        required
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="phone"
        placeholder="Phone Number"
        value={form.phone}
        onChange={handleChange}
        required
      />

      <select
        name="source"
        value={form.source}
        onChange={handleChange}
      >
        <option>Website</option>
        <option>LinkedIn</option>
        <option>Referral</option>
      </select>

      <textarea
        name="notes"
        placeholder="Notes"
        value={form.notes}
        onChange={handleChange}
      />

      <button type="submit">
        Add Lead
      </button>

    </form>

  </div>

  <div className="table-card">

    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
        flexWrap: "wrap",
        gap: "10px",
      }}
    >

      <h2>Lead List</h2>

      <input
        type="text"
        placeholder="Search leads by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "300px",
        }}
      />

    </div>

    <table>

      <thead>

        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Source</th>
          <th>Date Added</th>
          <th>Status</th>
          <th>Action</th>
        </tr>

      </thead>

      <tbody>

        {filteredLeads.map((lead) => (

          <tr key={lead._id}>

            <td>{lead.name}</td>

            <td>{lead.email}</td>

            <td>{lead.phone}</td>

            <td>
  <span className="source-badge">
    {lead.source}
  </span>
</td>

            <td>
              {new Date(lead.createdAt).toLocaleDateString()}
            </td>

           <td>
  <select
    className={`status ${lead.status.toLowerCase()}`}
    value={lead.status}
    onChange={(e) =>
      changeStatus(lead._id, e.target.value)
    }
  >
    <option>New</option>
    <option>Contacted</option>
    <option>Converted</option>
  </select>
</td>

            <td>

              <button
                onClick={() => deleteLead(lead._id)}
                style={{
                  background: "#ef4444",
                  padding: "8px 14px",
                }}
              >
                🗑 Delete
              </button>

            </td>

          </tr>

        ))}

      </tbody>

    </table>

  </div>

</div>
  );

}

export default Dashboard;