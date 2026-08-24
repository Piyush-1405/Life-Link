import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export const DataContext = createContext();

const INITIAL_REQUESTS = [
  {
    id: 'LLR-991234',
    patientName: 'Kavita Sundaram',
    patientAge: '34',
    bloodGroup: 'O+',
    component: 'WHOLE_BLOOD',
    quantity: 2,
    urgency: 'URGENT',
    status: 'BLOOD_RESERVED',
    hospital: 'AIIMS Delhi',
    searchRadiusKm: 10,
    location: { address: 'AIIMS Emergency, New Delhi', lat: '28.5672', lng: '77.2100' },
    notes: 'Elective cardio surgery support',
    contactPhone: '+91 98111 22334',
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    timeline: [
      { status: 'PENDING', label: 'Request Created', time: '2 hours ago', done: true },
      { status: 'INVENTORY_SEARCH', label: 'Checked Blood Bank Inventory', time: '2 hours ago', done: true },
      { status: 'BLOOD_RESERVED', label: 'Blood Reserved from Central Blood Bank (2 Units)', time: '2 hours ago', done: true },
      { status: 'FULFILLED', label: 'Blood Dispatch & Delivery', time: 'Pending', done: false },
    ]
  },
  {
    id: 'REQ-92384',
    patientName: 'Rahul Sharma',
    patientAge: '45',
    bloodGroup: 'A+',
    component: 'WHOLE_BLOOD',
    quantity: 2,
    urgency: 'CRITICAL',
    status: 'DONOR_SEARCH',
    hospital: 'City Memorial Hospital',
    searchRadiusKm: 15,
    location: { address: 'City Hospital ICU, Block B', lat: '28.6139', lng: '77.2090' },
    notes: 'Emergency polytrauma ward',
    contactPhone: '+91 98765 43210',
    createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    timeline: [
      { status: 'PENDING', label: 'Request Created', time: '5 hours ago', done: true },
      { status: 'INVENTORY_SEARCH', label: 'Inventory Checked (0 Units Available)', time: '5 hours ago', done: true },
      { status: 'DONOR_SEARCH', label: 'Searching Nearby Donors (8 Notified within 15 km)', time: 'In Progress', done: true, current: true },
      { status: 'DONOR_ACCEPTED', label: 'Donor Acceptance', time: 'Pending', done: false },
      { status: 'FULFILLED', label: 'Blood Dispatch & Delivery', time: 'Pending', done: false },
    ]
  },
  {
    id: 'REQ-92383',
    patientName: 'Ananya Verma',
    patientAge: '28',
    bloodGroup: 'O-',
    component: 'RBC',
    quantity: 1,
    urgency: 'URGENT',
    status: 'BLOOD_RESERVED',
    hospital: 'Metro Clinic Care',
    searchRadiusKm: 20,
    location: { address: 'Metro Clinic, Sector 18', lat: '28.5355', lng: '77.3910' },
    notes: 'Thalassemia regular transfusion',
    contactPhone: '+91 99887 76655',
    createdAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    timeline: [
      { status: 'PENDING', label: 'Request Created', time: '8 hours ago', done: true },
      { status: 'INVENTORY_SEARCH', label: 'Inventory Checked (1 Unit Found)', time: '8 hours ago', done: true },
      { status: 'BLOOD_RESERVED', label: 'Blood Reserved (1 Unit O- RBC)', time: '8 hours ago', done: true },
      { status: 'FULFILLED', label: 'Blood Dispatch & Delivery', time: 'Pending', done: false },
    ]
  },
  {
    id: 'LLR-887651',
    patientName: 'Sunil Mehta',
    patientAge: '52',
    bloodGroup: 'A-',
    component: 'PLASMA',
    quantity: 1,
    urgency: 'NORMAL',
    status: 'FULFILLED',
    hospital: 'City Hospital',
    searchRadiusKm: 20,
    location: { address: 'Civil Lines, Delhi', lat: '28.6750', lng: '77.2250' },
    notes: 'Liver treatment',
    contactPhone: '+91 97112 33445',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    timeline: [
      { status: 'PENDING', label: 'Request Created', time: '1 day ago', done: true },
      { status: 'INVENTORY_SEARCH', label: 'Checked Inventory', time: '1 day ago', done: true },
      { status: 'BLOOD_RESERVED', label: 'Blood Reserved', time: '1 day ago', done: true },
      { status: 'FULFILLED', label: 'Dispatched and Received ✓', time: 'Yesterday', done: true },
    ]
  },
  {
    id: 'LLR-773421',
    patientName: 'Vikram Singh',
    patientAge: '22',
    bloodGroup: 'B+',
    component: 'PLATELETS',
    quantity: 3,
    urgency: 'CRITICAL',
    status: 'DONOR_SEARCH',
    hospital: 'Apollo Emergency Care',
    searchRadiusKm: 50,
    location: { address: 'Sarita Vihar, Delhi', lat: '28.5300', lng: '77.2900' },
    notes: 'Dengue with low platelet count (18k)',
    contactPhone: '+91 96541 22334',
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    timeline: [
      { status: 'PENDING', label: 'Request Created', time: '3 hours ago', done: true },
      { status: 'INVENTORY_SEARCH', label: 'Inventory Insufficient for 3 Platelet Units', time: '3 hours ago', done: true },
      { status: 'DONOR_SEARCH', label: 'Notified 14 Compatible Donors nearby', time: 'In Progress', done: true, current: true },
      { status: 'DONOR_ACCEPTED', label: 'Donor Acceptance', time: 'Pending', done: false },
      { status: 'FULFILLED', label: 'Blood Dispatch & Delivery', time: 'Pending', done: false },
    ]
  }
];

const INITIAL_INVENTORY = [
  { id: 'UNT-89104', bloodGroup: 'O+', component: 'RBC', location: 'Fridge A-02', status: 'AVAILABLE', expiryDate: '2026-09-15' },
  { id: 'UNT-89105', bloodGroup: 'O+', component: 'WHOLE_BLOOD', location: 'Fridge A-03', status: 'AVAILABLE', expiryDate: '2026-09-18' },
  { id: 'UNT-89106', bloodGroup: 'O+', component: 'WHOLE_BLOOD', location: 'Fridge A-03', status: 'AVAILABLE', expiryDate: '2026-09-19' },
  { id: 'UNT-89107', bloodGroup: 'O+', component: 'WHOLE_BLOOD', location: 'Fridge A-04', status: 'RESERVED', reservedForRequestId: 'LLR-991234', expiryDate: '2026-09-12' },
  { id: 'UNT-89108', bloodGroup: 'O+', component: 'WHOLE_BLOOD', location: 'Fridge A-04', status: 'RESERVED', reservedForRequestId: 'LLR-991234', expiryDate: '2026-09-12' },
  { id: 'UNT-89103', bloodGroup: 'A+', component: 'WHOLE_BLOOD', location: 'Fridge A-01', status: 'AVAILABLE', expiryDate: '2026-09-02' },
  { id: 'UNT-89109', bloodGroup: 'A+', component: 'RBC', location: 'Fridge A-01', status: 'AVAILABLE', expiryDate: '2026-09-22' },
  { id: 'UNT-89102', bloodGroup: 'B+', component: 'PLATELETS', location: 'Agitator 1', status: 'AVAILABLE', expiryDate: '2026-08-27' },
  { id: 'UNT-89110', bloodGroup: 'B+', component: 'WHOLE_BLOOD', location: 'Fridge B-01', status: 'AVAILABLE', expiryDate: '2026-09-14' },
  { id: 'UNT-89101', bloodGroup: 'AB-', component: 'PLASMA', location: 'Deep Freezer 2', status: 'AVAILABLE', expiryDate: '2027-02-10' },
  { id: 'UNT-89100', bloodGroup: 'O-', component: 'RBC', location: 'Fridge B-03', status: 'RESERVED', reservedForRequestId: 'REQ-92383', expiryDate: '2026-09-20' },
  { id: 'UNT-89111', bloodGroup: 'O-', component: 'WHOLE_BLOOD', location: 'Fridge B-03', status: 'AVAILABLE', expiryDate: '2026-09-05' },
  { id: 'UNT-89112', bloodGroup: 'A-', component: 'PLASMA', location: 'Deep Freezer 1', status: 'AVAILABLE', expiryDate: '2027-01-15' },
  { id: 'UNT-89113', bloodGroup: 'AB+', component: 'WHOLE_BLOOD', location: 'Fridge C-01', status: 'AVAILABLE', expiryDate: '2026-09-25' },
];

const INITIAL_RESERVATIONS = [
  {
    id: 'RES-501',
    requestId: 'LLR-991234',
    hospital: 'AIIMS Delhi',
    bloodGroup: 'O+',
    component: 'WHOLE_BLOOD',
    units: 2,
    unitIds: ['UNT-89107', 'UNT-89108'],
    status: 'ACTIVE',
    expiresAt: 'In 18h 30m',
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
  },
  {
    id: 'RES-502',
    requestId: 'REQ-92383',
    hospital: 'Metro Clinic Care',
    bloodGroup: 'O-',
    component: 'RBC',
    units: 1,
    unitIds: ['UNT-89100'],
    status: 'ACTIVE',
    expiresAt: 'In 12h 45m',
    createdAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString()
  }
];

const INITIAL_DONATIONS = [
  { id: 'DN-8371', donorName: 'Amit Patel', donorId: 'D-1029', bloodGroup: 'A-', component: 'WHOLE_BLOOD', stage: 'TESTING', date: 'Today, 11:30 AM' },
  { id: 'DN-8370', donorName: 'Sneha Rao', donorId: 'D-1028', bloodGroup: 'O+', component: 'RBC', stage: 'PROCESSING', date: 'Today, 10:15 AM' },
  { id: 'DN-8369', donorName: 'Kunal Joshi', donorId: 'D-1027', bloodGroup: 'B+', component: 'PLATELETS', stage: 'COMPLETED', date: 'Yesterday' },
];

const INITIAL_USERS = [
  { id: 'USR-101', name: 'City Memorial Hospital', email: 'admin@cityhospital.org', role: 'HOSPITAL', status: 'ACTIVE', verified: true },
  { id: 'USR-102', name: 'Central Red Cross Blood Bank', email: 'dispatch@redcrossbank.org', role: 'BLOOD_BANK', status: 'ACTIVE', verified: true },
  { id: 'USR-103', name: 'John Doe (Donor)', email: 'john.doe@gmail.com', role: 'DONOR', status: 'ACTIVE', verified: true },
  { id: 'USR-104', name: 'Metro Clinic Care', email: 'info@metroclinic.com', role: 'HOSPITAL', status: 'PENDING_VERIFICATION', verified: false },
  { id: 'USR-105', name: 'Sarah Jenkins (Patient)', email: 'sarah.j@outlook.com', role: 'PATIENT', status: 'ACTIVE', verified: true },
];

export const DataProvider = ({ children }) => {
  const [requests, setRequests] = useState(() => {
    const saved = localStorage.getItem('lifelink_requests');
    return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
  });

  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem('lifelink_inventory');
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });

  const [reservations, setReservations] = useState(() => {
    const saved = localStorage.getItem('lifelink_reservations');
    return saved ? JSON.parse(saved) : INITIAL_RESERVATIONS;
  });

  const [donations, setDonations] = useState(() => {
    const saved = localStorage.getItem('lifelink_donations');
    return saved ? JSON.parse(saved) : INITIAL_DONATIONS;
  });

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('lifelink_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  // Sync with LocalStorage
  useEffect(() => { localStorage.setItem('lifelink_requests', JSON.stringify(requests)); }, [requests]);
  useEffect(() => { localStorage.setItem('lifelink_inventory', JSON.stringify(inventory)); }, [inventory]);
  useEffect(() => { localStorage.setItem('lifelink_reservations', JSON.stringify(reservations)); }, [reservations]);
  useEffect(() => { localStorage.setItem('lifelink_donations', JSON.stringify(donations)); }, [donations]);
  useEffect(() => { localStorage.setItem('lifelink_users', JSON.stringify(users)); }, [users]);

  // Core Rule: Inventory-First Check & Automatic Reservation
  const createRequest = (requestData) => {
    const newId = `LLR-${Math.floor(100000 + Math.random() * 900000)}`;
    const quantity = parseInt(requestData.quantity) || 1;

    // Check inventory for matching available units
    const availableMatchingUnits = inventory.filter(
      u => u.bloodGroup === requestData.bloodGroup &&
           u.component === requestData.component &&
           u.status === 'AVAILABLE'
    );

    const isAvailableInStock = availableMatchingUnits.length >= quantity;

    let initialStatus = isAvailableInStock ? 'BLOOD_RESERVED' : 'DONOR_SEARCH';
    let timeline = [
      { status: 'PENDING', label: 'Request Created', time: 'Just now', done: true },
      { 
        status: 'INVENTORY_SEARCH', 
        label: isAvailableInStock 
          ? `Inventory Check: ${availableMatchingUnits.length} unit(s) available in blood bank` 
          : `Inventory Check: Insufficient stock (${availableMatchingUnits.length} available, ${quantity} needed)`, 
        time: 'Just now', 
        done: true 
      }
    ];

    let reservedUnitIds = [];

    if (isAvailableInStock) {
      // Automatically reserve the units in inventory
      const unitsToReserve = availableMatchingUnits.slice(0, quantity);
      reservedUnitIds = unitsToReserve.map(u => u.id);

      setInventory(prev => prev.map(u => {
        if (reservedUnitIds.includes(u.id)) {
          return { ...u, status: 'RESERVED', reservedForRequestId: newId };
        }
        return u;
      }));

      // Create an active reservation
      const newReservation = {
        id: `RES-${Math.floor(500 + Math.random() * 500)}`,
        requestId: newId,
        hospital: requestData.hospital || 'Patient Emergency Request',
        bloodGroup: requestData.bloodGroup,
        component: requestData.component,
        units: quantity,
        unitIds: reservedUnitIds,
        status: 'ACTIVE',
        expiresAt: 'In 24h 00m',
        createdAt: new Date().toISOString()
      };

      setReservations(prev => [newReservation, ...prev]);

      timeline.push({
        status: 'BLOOD_RESERVED',
        label: `Auto-Reserved ${quantity} unit(s) from Blood Bank inventory (Lock Active)`,
        time: 'Just now',
        done: true,
        current: true
      });
      timeline.push({
        status: 'FULFILLED',
        label: 'Ready for Blood Bank dispatch & patient fulfillment',
        time: 'Pending',
        done: false
      });
    } else {
      timeline.push({
        status: 'DONOR_SEARCH',
        label: `Searching compatible eligible donors within ${requestData.searchRadiusKm || 10} km radius`,
        time: 'In Progress',
        done: true,
        current: true
      });
      timeline.push({
        status: 'DONOR_ACCEPTED',
        label: 'Donor Acceptance & Appointment',
        time: 'Pending',
        done: false
      });
      timeline.push({
        status: 'FULFILLED',
        label: 'Blood Donation, Testing & Fulfillment',
        time: 'Pending',
        done: false
      });
    }

    const newRequest = {
      id: newId,
      patientName: requestData.patientName || 'Emergency Patient',
      patientAge: requestData.patientAge || '30',
      bloodGroup: requestData.bloodGroup,
      component: requestData.component,
      quantity: quantity,
      urgency: requestData.urgency || 'URGENT',
      status: initialStatus,
      hospital: requestData.hospital || 'City General Hospital',
      searchRadiusKm: requestData.searchRadiusKm || 10,
      location: requestData.location || { address: 'Local Hospital', lat: '28.6139', lng: '77.2090' },
      notes: requestData.notes || '',
      contactPhone: requestData.contactPhone || '',
      createdAt: new Date().toISOString(),
      timeline: timeline
    };

    setRequests(prev => [newRequest, ...prev]);

    return { request: newRequest, autoReserved: isAvailableInStock, reservedUnitCount: reservedUnitIds.length };
  };

  // Cancel Request Action
  const cancelRequest = (requestId) => {
    const target = requests.find(r => r.id === requestId);
    if (!target) return;

    // Release any reserved inventory units
    setInventory(prev => prev.map(u => {
      if (u.reservedForRequestId === requestId) {
        return { ...u, status: 'AVAILABLE', reservedForRequestId: null };
      }
      return u;
    }));

    // Release reservations
    setReservations(prev => prev.map(res => {
      if (res.requestId === requestId) {
        return { ...res, status: 'RELEASED' };
      }
      return res;
    }));

    // Update request
    setRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        return {
          ...r,
          status: 'CANCELLED',
          timeline: [
            ...r.timeline.map(t => ({ ...t, current: false })),
            { status: 'CANCELLED', label: 'Request Cancelled by Requester', time: 'Just now', done: true, current: true }
          ]
        };
      }
      return r;
    }));

    toast.success(`Request ${requestId} has been cancelled and any reserved blood released.`);
  };

  // Blood Bank Fulfill Reservation Action
  const fulfillReservation = (reservationId) => {
    const res = reservations.find(r => r.id === reservationId);
    if (!res) return;

    // Mark inventory units as USED
    setInventory(prev => prev.map(u => {
      if (res.unitIds && res.unitIds.includes(u.id)) {
        return { ...u, status: 'USED' };
      }
      return u;
    }));

    // Update reservation
    setReservations(prev => prev.map(r => r.id === reservationId ? { ...r, status: 'FULFILLED' } : r));

    // Update Request to FULFILLED
    if (res.requestId) {
      setRequests(prev => prev.map(req => {
        if (req.id === res.requestId) {
          return {
            ...req,
            status: 'FULFILLED',
            timeline: [
              ...req.timeline.map(t => ({ ...t, current: false, done: true })),
              { status: 'FULFILLED', label: 'Blood Dispatched & Received ✓', time: 'Just now', done: true, current: true }
            ]
          };
        }
        return req;
      }));
    }

    toast.success(`Reservation ${reservationId} fulfilled! Blood dispatched.`);
  };

  // Blood Bank Release Reservation Action
  const releaseReservation = (reservationId) => {
    const res = reservations.find(r => r.id === reservationId);
    if (!res) return;

    // Return inventory units to AVAILABLE
    setInventory(prev => prev.map(u => {
      if (res.unitIds && res.unitIds.includes(u.id)) {
        return { ...u, status: 'AVAILABLE', reservedForRequestId: null };
      }
      return u;
    }));

    // Update reservation
    setReservations(prev => prev.map(r => r.id === reservationId ? { ...r, status: 'RELEASED' } : r));

    // Put request back to DONOR_SEARCH
    if (res.requestId) {
      setRequests(prev => prev.map(req => {
        if (req.id === res.requestId) {
          return {
            ...req,
            status: 'DONOR_SEARCH',
            timeline: [
              ...req.timeline.filter(t => t.status !== 'BLOOD_RESERVED'),
              { status: 'DONOR_SEARCH', label: 'Reservation Released. Searching Nearby Donors.', time: 'Just now', done: true, current: true }
            ]
          };
        }
        return req;
      }));
    }

    toast.success(`Reservation ${reservationId} released. Units returned to available inventory.`);
  };

  // Add Blood Inventory Unit Action
  const addInventoryUnit = (unit) => {
    const newUnit = {
      id: `UNT-${Math.floor(10000 + Math.random() * 90000)}`,
      bloodGroup: unit.bloodGroup || 'O+',
      component: unit.component || 'WHOLE_BLOOD',
      location: unit.location || 'Fridge A-01',
      status: 'AVAILABLE',
      expiryDate: unit.expiryDate || new Date(Date.now() + 35 * 24 * 3600 * 1000).toISOString().split('T')[0]
    };

    setInventory(prev => [newUnit, ...prev]);
    toast.success(`Added ${newUnit.bloodGroup} ${newUnit.component} (${newUnit.id}) to inventory!`);
    return newUnit;
  };

  // Advance Donation Stage Action
  const advanceDonationStage = (donationId) => {
    const stages = ['SCHEDULED', 'SCREENING', 'COLLECTING', 'TESTING', 'PROCESSING', 'COMPLETED'];

    setDonations(prev => prev.map(d => {
      if (d.id === donationId) {
        const currentIndex = stages.indexOf(d.stage);
        const nextStage = currentIndex < stages.length - 1 ? stages[currentIndex + 1] : d.stage;

        if (nextStage === 'COMPLETED' && d.stage !== 'COMPLETED') {
          // Automatically add unit to inventory!
          addInventoryUnit({
            bloodGroup: d.bloodGroup,
            component: d.component,
            location: 'Central Storage'
          });
          toast.success(`Donation ${donationId} complete! Unit added to inventory.`);
        } else {
          toast.success(`Donation ${donationId} updated to ${nextStage}`);
        }

        return { ...d, stage: nextStage };
      }
      return d;
    }));
  };

  // Add Walk-in Donor Action
  const addWalkInDonation = (donation) => {
    const newDonation = {
      id: `DN-${Math.floor(8000 + Math.random() * 1000)}`,
      donorName: donation.donorName || 'Walk-in Donor',
      donorId: `D-${Math.floor(1000 + Math.random() * 9000)}`,
      bloodGroup: donation.bloodGroup || 'O+',
      component: donation.component || 'WHOLE_BLOOD',
      stage: 'COLLECTING',
      date: 'Today, Just now'
    };

    setDonations(prev => [newDonation, ...prev]);
    toast.success(`Registered walk-in donor ${newDonation.donorName} (${newDonation.bloodGroup})`);
    return newDonation;
  };

  // Toggle User Status Action (Admin)
  const toggleUserStatus = (userId) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        toast.success(`User ${u.name} status changed to ${nextStatus}`);
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  // Add Verified Entity (Admin)
  const addVerifiedEntity = (entity) => {
    const newUser = {
      id: `USR-${Math.floor(100 + Math.random() * 900)}`,
      name: entity.name,
      email: entity.email,
      role: entity.role || 'HOSPITAL',
      status: 'ACTIVE',
      verified: true
    };
    setUsers(prev => [newUser, ...prev]);
    toast.success(`Added verified ${newUser.role} entity: ${newUser.name}`);
    return newUser;
  };

  return (
    <DataContext.Provider value={{
      requests,
      inventory,
      reservations,
      donations,
      users,
      createRequest,
      cancelRequest,
      fulfillReservation,
      releaseReservation,
      addInventoryUnit,
      advanceDonationStage,
      addWalkInDonation,
      toggleUserStatus,
      addVerifiedEntity
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
