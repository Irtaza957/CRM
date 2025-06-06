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
import dayjs from "dayjs";

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
    padding: 10,
    fontSize: 12,
  },
  tableCol: { width: "25%", padding: 10 },
  footer: { marginTop: 30, textAlign: "center" },
  footerContainer: {
    position: 'absolute',   // <— pins it
    bottom: 30,             // distance from page bottom
    left: 30,
    right: 30,
    borderTop: '1.5 solid #116FAC',
    paddingTop: 10,
    paddingHorizontal: 10,
    color: '#6b7280',
  },

  footerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    marginTop: 5,
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
  headerText: { color: "#116FAC", fontSize: 21, fontWeight: "550" },
  textColor: { color: "#6b7280" },
});
interface PageProps {
  title: string;
  invoiceNum: { name: string; value: string };
  data: any;
}
// PDF Content Component
const PageComponent = ({ title, invoiceNum, data }: PageProps) => {
  const date = dayjs(data?.schedule_date).format("DD MMM, YYYY");
  return (
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.headerSection}>
        <Image src={"/logo.png"} style={styles.logo} />
        <Text style={styles.headerText}>{title}</Text>
      </View>

      {/* Sender & Receiver */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          borderTop: "2 solid #E5E7EB",
          paddingTop: 20,
          paddingBottom: 10,
          marginTop: 20,
        }}
      >
        <View>
          <View
            style={{
              ...styles.section,
            }}
          >
            <Text style={{ color: "#116FAC", fontSize: 16, fontWeight: "500" }}>
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
            <Text style={{ color: "#116FAC", fontSize: 16, fontWeight: "500" }}>
              Invoice To
            </Text>
            <Text style={{ marginVertical: 5, ...styles.textColor }}>
              {data?.customer?.firstname} {data?.customer?.lastname}
            </Text>
            <Text style={styles.textColor}>{data?.customer?.phone}</Text>
            <Text style={{ ...styles.textColor, marginVertical: 5 }}>
              {data?.address.apartment},&nbsp;
              {data?.address.building}, {data?.address.street || '-'},{" "}
              {data?.address.area || '-'}, {data?.address.emirate}
            </Text>
          </View>
        </View>
        <View style={{ color: "#6b7280" }}>
          <View>
            <Text style={{ width: "100px", textAlign: "right" }}>
              {invoiceNum.name}
            </Text>
            <Text
              style={{
                fontWeight: "600",
                textAlign: "right",
                marginTop: 2,
                width: "100px",
              }}
            >
              {invoiceNum.value}
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
              {date}
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

        {data?.services?.map((service: any, i: number) => (
          <View
            style={{
              ...styles.tableRow,
              backgroundColor: i % 2 === 0 ? "#f3f5f9" : "white",
              color: "#6b7280",
            }}
            key={i}
          >
            <Text style={styles.tableCol}>{service.service_name}</Text>
            <Text style={styles.tableCol}>{service.price}</Text>
            <Text style={styles.tableCol}>{service.quantity}</Text>
            <Text style={styles.tableCol}>{service.total}</Text>
          </View>
        ))}
      </View>

      {/* Totals */}

      <View style={{ marginTop: 20, alignItems: "flex-end" }}>
        {(title === "TAX INVOICE" || title === "PROFORMA INVOICE") && (
          <>
            <View
              style={{
                flexDirection: "row",
                fontSize: 12,
                fontWeight: "600",
                color: "#6b7280",
              }}
            >
              <Text> Sub Total:</Text>
              <Text style={{ width: "80px", textAlign: "right" }}>
                {data?.sub_total}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                fontSize: 12,
                fontWeight: "600",
                marginVertical: 5,
                color: "#6b7280",
              }}
            >
              <Text>
                Discount ({data?.discount_value}
                {data?.discount_type === "fixed" ? " AED" : "%"}):
              </Text>
              <Text style={{ width: "80px", textAlign: "right" }}>
                {data?.discount}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                fontSize: 12,
                fontWeight: "600",
                color: "#6b7280",
              }}
            >
              <Text>Tax (5%):</Text>
              <Text style={{ width: "80px", textAlign: "right" }}>
                {data?.vat_value}
              </Text>
            </View>
          </>
        )}
        <View
          style={{
            flexDirection: "row",
            fontSize: 13,
            fontWeight: "600",
            color: "white",
            marginTop: 15,
            backgroundColor: "#116FAC",
            paddingHorizontal: 22,
            paddingVertical: 8,
          }}
        >
          <Text>
            {title === "QUOTATION"
              ? "Total Quote"
              : title === "ESTIMATE"
                ? "Estimated Total"
                : "Grand Total"}
            :
          </Text>
          <Text style={{ textAlign: "right", marginLeft: 10 }}>
            AED {data?.total}
          </Text>
        </View>
        {title !== "TAX INVOICE" && (
          <View style={{ marginTop: 10, color: "#6b7280" }}>
            <Text style={{ fontSize: 9, textAlign: "right", width: "400px" }}>
              {title === "QUOTATION"
                ? "Terms: Valid for 7 days. Subject to availability."
                : title === "PROFORMA INVOICE"
                  ? "This is a proforma invoice and not a tax invoice."
                  : "This is an estimate only. Final amount may vary based on"}
            </Text>
            {title === "ESTIMATE" && (
              <Text
                style={{
                  fontSize: 9,
                  textAlign: "right",
                  width: "400px",
                  marginTop: 3,
                }}
              >
                actual services rendered.
              </Text>
            )}
            {title === "ESTIMATE" && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                  textAlign: "right",
                  justifyContent: "flex-end",
                  marginTop: 5,
                }}
              >
                <Text style={{ fontSize: 9 }}>Valid Until:</Text>
                <Text style={{ fontSize: 11, fontWeight: "600", marginTop: 2 }}>
                  01 Jan, 2024
                </Text>
              </View>
            )}
          </View>
        )}
      </View>

      <View style={{ marginTop: 40, color: "#6b7280" }}>
        {/* <Text>Stamp & Sign</Text> */}
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
              <Text style={{ marginBottom: 3 }}>Grosvenor Business Tower</Text>
              <Text>Al Barsha Heights</Text>
            </View>
          </View>

          <View>
            <Image
              src={"/QR_code.PNG"}
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: 40,
                height: 40,
                marginLeft: "20px",
              }}
            />
          </View>
        </View>
      </View>
    </Page>
  );
};
const InvoiceDocument = ({ data }: any) => {
  return (
    <Document>
      <PageComponent
        title={"TAX INVOICE"}
        invoiceNum={{ name: "Tax Invoice No.", value: data?.booking_id }}
        data={data}
      />
      {/* <PageComponent
      title={"ESTIMATE"}
      invoiceNum={{ name: "Estimate No.", value: "EST-0001" }}
      data={data}
    />
    <PageComponent
      title={"PROFORMA INVOICE"}
      invoiceNum={{ name: "Invoice No.", value: "PI-0001" }}
      data={data}
    />
    <PageComponent
      title={"QUOTATION"}
      invoiceNum={{ name: "Quote Ref.", value: "QT-0001" }}
      data={data}
    /> */}
    </Document>
  );
};

const InvoicePdf = ({ data }: any) => {
  console.log(data, "datadata");
  return (
    <PDFDownloadLink
      document={<InvoiceDocument data={data} />}
      fileName="invoice.pdf"
    >
      <CustomButton name="Invoice" handleClick={() => {}} />
    </PDFDownloadLink>
  );
};

export default InvoicePdf;
