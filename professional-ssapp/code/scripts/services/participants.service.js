class ParticipantsService {
  SERVICE_PATH = '/trials';
  countries = ['US', 'GR', 'IT', 'ES', 'UK', 'RO', 'PT', 'ES'];

  trials = Array.from({ length: Math.floor(Math.random() * Math.floor(5) + 1) }, (_, i) => i + 1).map((y) => ({
    id: y,
    name: `trial ${y}`,
    progress: Math.floor(Math.random() * 100),
    status: Math.floor(Math.random() * 2),
    enrolled: Math.floor(Math.random() * 500),
    total: Math.floor(Math.random() * 1000),
    countries: this.countries.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 2 + 1)),
    started: this.randomDate(new Date(2012, 0, 1), new Date()).toISOString().slice(0, 10),
  }));

  sites = Array.from({ length: Math.floor(Math.random() * Math.floor(10) + 2) }, (_, i) => i + 1).map((y) => ({
    name: `Site ${y}`,
    country: this.countries[Math.floor(Math.random() * this.countries.length)],
    enteredTrial: this.randomDate(new Date(2012, 0, 1), new Date()).toISOString().slice(0, 10),
  }));

  consents = Array.from({ length: Math.floor(Math.random() * Math.floor(10) + 2) }, (_, i) => i + 1).map((y) => ({
    name: `Consent name ${Math.floor(Math.random() * Math.floor(3) + 1)}`,
    version: Math.random().toFixed(1),
    update: this.randomDate(new Date(2012, 0, 1), new Date()).toISOString().slice(0, 10),
    created: this.randomDate(new Date(2012, 0, 1), new Date()).toISOString().slice(0, 10),
    filename: `filename${y}`,
    current: Math.floor(Math.random() * Math.floor(2)) ? true : false,
  }));

  consentStatuses = ['Withdrew', 'Waiting re-consent', 'Consent'];

  trialsInfo = this.trials.map((x) => ({
    id: x.id,
    consents: this.consents,
    sites: this.sites,
    participants: Array.from({ length: Math.floor(Math.random() * Math.floor(10) + 1) }, (_, i) => i + 1).map((y) => ({
      id: y,
      deviceStatus: 'OK',
      country: this.countries[Math.floor(Math.random() * this.countries.length)],
      site: this.sites[Math.floor(Math.random() * this.sites.length)],
      consent: this.consents[Math.floor(Math.random() * this.consents.length)],
      consentVersion: Math.random().toFixed(1),
      consentStatus: this.consentStatuses[Math.floor(Math.random() * this.consentStatuses.length)],
      patientSigned: this.randomDate(new Date(2012, 0, 1), new Date()).toISOString().slice(0, 10),
      hcpSigned: this.randomDate(new Date(2012, 0, 1), new Date()).toISOString().slice(0, 10),
      lastSignedICF: null,
    })),
  }));

  randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }

  constructor(DSUStorage) {
    this.DSUStorage = DSUStorage;
  }

  getTrials() {
    const result = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.trials);
      }, 300);
    });
    return result;
  }

  getTrial(id) {
    const result = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.trialsInfo.find((x) => x.id === id));
      }, 300);
    });
    return result;
  }

  getTrialConsents(id) {
    const result = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.consents);
      }, 300);
    });
    return result;
  }

  getTrialParticipants(id) {
    const result = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.trialsInfo.find((x) => x.id === id).participants);
      }, 300);
    });
    return result;
  }
}

export const participantsService = new ParticipantsService();
