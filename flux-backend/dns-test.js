const dns = require("dns");

dns.resolveSrv(
  "_mongodb._tcp.cluster0.97rpiub.mongodb.net",
  (error, addresses) => {
    if (error) {
      console.error("DNS ERROR:", error);
      return;
    }

    console.log("SRV RECORDS:");
    console.log(addresses);
  },
);