const ApiError = require('../utils/ApiError');

class CompatibilityService {
  constructor() {
    this.rbcMatrix = {
      'O-': ['O-'],
      'O+': ['O-', 'O+'],
      'A-': ['O-', 'A-'],
      'A+': ['O-', 'O+', 'A-', 'A+'],
      'B-': ['O-', 'B-'],
      'B+': ['O-', 'O+', 'B-', 'B+'],
      'AB-': ['O-', 'A-', 'B-', 'AB-'],
      'AB+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+']
    };

    this.plasmaMatrix = {
      'AB+': ['AB+', 'AB-'],
      'AB-': ['AB-', 'A-', 'B-', 'O-'],
      'A+': ['A+', 'A-', 'AB+', 'AB-'],
      'A-': ['A-', 'AB-'],
      'B+': ['B+', 'B-', 'AB+', 'AB-'],
      'B-': ['B-', 'AB-'],
      'O+': ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'],
      'O-': ['O-', 'A-', 'B-', 'AB-']
    };
  }

  getCompatibleDonorGroups(recipientGroup, component) {
    if (!recipientGroup) throw new ApiError(400, 'Recipient blood group required');
    if (!component) throw new ApiError(400, 'Component required');

    switch (component) {
      case 'WHOLE_BLOOD':
        return [recipientGroup]; // Exact match only
      case 'RBC':
      case 'PLATELETS':
        return this.rbcMatrix[recipientGroup] || [];
      case 'PLASMA':
        return this.plasmaMatrix[recipientGroup] || [];
      default:
        throw new ApiError(400, `Unknown component: ${component}`);
    }
  }

  getCompatibleRecipientGroups(donorGroup, component) {
    if (!donorGroup) throw new ApiError(400, 'Donor blood group required');
    if (!component) throw new ApiError(400, 'Component required');

    const compatibleRecipients = [];
    const allGroups = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

    for (const recipientGroup of allGroups) {
      const compatibleDonors = this.getCompatibleDonorGroups(recipientGroup, component);
      if (compatibleDonors.includes(donorGroup)) {
        compatibleRecipients.push(recipientGroup);
      }
    }

    return compatibleRecipients;
  }

  isCompatible(donorGroup, recipientGroup, component) {
    const compatibleDonors = this.getCompatibleDonorGroups(recipientGroup, component);
    return compatibleDonors.includes(donorGroup);
  }
}

module.exports = new CompatibilityService();
