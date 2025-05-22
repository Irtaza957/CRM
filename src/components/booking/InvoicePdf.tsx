import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
  Image,
} from "@react-pdf/renderer";
import CustomButton from "../ui/CustomButton";

// Styles
const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 10, fontFamily: "Helvetica" },
  section: { marginBottom: 10 },
  header: { fontSize: 18, color: "#116FAC", marginBottom: 10 },
  table: { width: "auto", marginTop: 10 },
  tableRow: { flexDirection: "row" },
  tableColHeader: {
    width: "25%",
    backgroundColor: "#116FAC",
    color: "white",
    padding: 15,
  },
  tableCol: { width: "25%", padding: 15 },
  footer: { marginTop: 30, textAlign: "center" },
  footerContainer: {
    marginTop: 50,
    borderTop: "1 solid #116FAC",
    paddingTop: 10,
    paddingHorizontal: 10,
  },

  footerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },

  footerHeaderTab: {
    backgroundColor: "#116FAC",
    width: 10,
    height: 12,
    marginRight: 5,
  },

  footerHeaderText: {
    fontSize: 12,
    fontWeight: "bold",
  },

  footerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 9,
    marginTop: 5,
  },

  footerColumn: {
    width: "30%",
  },

  qrCode: {
    width: 40,
    height: 40,
    alignSelf: "flex-end",
  },
  headerSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  logo: { width: 150, height: 36 },
  headerText: { color: "#116FAC", fontSize: 18, fontWeight: "bold" },
  textColor: { color: "#858688 " },
});

// PDF Content Component
const InvoiceDocument = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.headerSection}>
        <Image src={"/logo.png"} style={styles.logo} />
        <Text style={styles.headerText}>TAX INVOICE</Text>
      </View>

      {/* Sender & Receiver */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          borderTop: "1 solid #E5E7EB",
          paddingTop: 20,
          paddingBottom: 10,
          marginTop: 10,
        }}
      >
        <View>
          <View
            style={{
              ...styles.section,
            }}
          >
            <Text style={{ color: "#116FAC", fontSize: 16, fontWeight: "600" }}>
              City Doctor LLC
            </Text>
            <Text style={{ marginVertical: 5, ...styles.textColor }}>
              Grosvenor Business Tower, Office 1507
            </Text>
            <Text style={styles.textColor}>Al Barsha Heights - Dubai</Text>
            <Text style={{ marginVertical: 5, ...styles.textColor }}>
              Phone: +971 55 755 9446
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={{ color: "#116FAC", fontSize: 16, fontWeight: "600" }}>
              Invoice To
            </Text>
            <Text style={{ marginVertical: 5, ...styles.textColor }}>
              Sanddep Dev
            </Text>
            <Text style={styles.textColor}>+971 55 755 9446</Text>
            <Text style={{ ...styles.textColor, marginVertical: 5 }}>
              Green View Building 5, Sharjah, UAE
            </Text>
            <Text style={styles.textColor}>Industal area 1, Sharjah, UAE</Text>
          </View>
        </View>
        <View>
          <View>
            <Text style={{ width: "100px", textAlign: "right" }}>
              Tax Invoice No.
            </Text>
            <Text
              style={{
                fontWeight: "600",
                textAlign: "right",
                marginTop: 2,
                width: "100px",
              }}
            >
              56466HGD
            </Text>
          </View>
          <View style={{ marginTop: 10 }}>
            <Text style={{ textAlign: "right", width: "100px" }}>Date</Text>
            <Text
              style={{
                fontWeight: "600",
                textAlign: "right",
                marginTop: 2,
                width: "100px",
              }}
            >
              01 Jan, 2024
            </Text>
          </View>
        </View>
      </View>

      {/* Table */}
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableColHeader}>Item Description</Text>
          <Text style={styles.tableColHeader}>Unit Price</Text>
          <Text style={styles.tableColHeader}>Qty</Text>
          <Text style={styles.tableColHeader}>Total</Text>
        </View>

        {[...Array(4)].map((_, i) => (
          <View
            style={{
              ...styles.tableRow,
              backgroundColor: i % 2 === 0 ? "#f3f5f9" : "white",
            }}
            key={i}
          >
            <Text style={styles.tableCol}>Service #{i + 1}</Text>
            <Text style={styles.tableCol}>000.00</Text>
            <Text style={styles.tableCol}>1</Text>
            <Text style={styles.tableCol}>000.00</Text>
          </View>
        ))}
      </View>

      {/* Totals */}
      <View style={{ marginTop: 20, alignItems: "flex-end" }}>
        <View style={{ flexDirection: "row", fontSize: 12, fontWeight: "600" }}>
          <Text> Sub Total:</Text>
          <Text style={{ width: "80px", textAlign: "right" }}>000.00</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            fontSize: 12,
            fontWeight: "600",
            marginVertical: 5,
          }}
        >
          <Text>Discount (2%):</Text>
          <Text style={{ width: "80px", textAlign: "right" }}>000.00</Text>
        </View>
        <View style={{ flexDirection: "row", fontSize: 12, fontWeight: "600" }}>
          <Text>Tax (5%):</Text>
          <Text style={{ width: "80px", textAlign: "right" }}>000.00</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            fontSize: 12,
            fontWeight: "600",
            color: "white",
            marginTop: 15,
            backgroundColor: "#116FAC",
            paddingHorizontal: 20,
            paddingVertical: 6,
          }}
        >
          <Text>Grand Total:</Text>
          <Text style={{ width: "80px", textAlign: "right" }}>
            AED 0,000.00
          </Text>
        </View>
      </View>

      <View style={{ marginTop: 40 }}>
        <Text>Stamp & Sign</Text>
      </View>

      {/* Footer */}
      <View style={styles.footerContainer}>
        {/* Contact Header */}
        <View style={styles.footerHeader}>
          <Text style={styles.footerHeaderText}>Contact</Text>
        </View>

        {/* Contact Details Row */}
        <View style={styles.footerContent}>
          {/* Phone */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Image src={"/phone.png"} style={{ width: 20, height: 20 }} />
            <View style={styles.footerColumn}>
              <Text style={{ marginBottom: 3 }}>+971 55 755 9446</Text>
              <Text>+971 4 32 00 000</Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Image src={"/globe.png"} style={{ width: 20, height: 20 }} />
            <View style={styles.footerColumn}>
              <Text style={{ marginBottom: 3 }}>info@citydoctor.ae</Text>
              <Text>www.citydoctor.ae</Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Image src={"/location.png"} style={{ width: 20, height: 20 }} />
            <View style={styles.footerColumn}>
              <Text style={{ marginBottom: 3 }}>
                Grosvenor Business Tower Office 1507
              </Text>
              <Text>Al Barsha Heights</Text>
            </View>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

const InvoicePdf = () => {
  return (
    <PDFDownloadLink document={<InvoiceDocument />} fileName="invoice.pdf">
      <CustomButton name="Invoice" handleClick={() => {}} />
    </PDFDownloadLink>
  );
};

export default InvoicePdf;
