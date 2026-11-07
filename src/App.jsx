import { useState } from "react";
import "./App.css";
import { Select, Input, Checkbox, Button, Upload, message } from "antd";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

const MAX_FILES = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB, khớp với giới hạn của bucket "evidence"

const normalizeSearchText = (text = "") => {
  return String(text)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .trim();
};

export default function SPXReportForm() {
  const initialFormData = {
    workingRegion: "",
    employeeGroup: "",
    hubSName: "",
    affectedEntity: "",
    incidentDescription: "",
    contactInfo: "",
    agreePolicy: false,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [fileList, setFileList] = useState([]);
  const [showPolicyError, setShowPolicyError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "agreePolicy") {
      setShowPolicyError(!checked);
    }
  };

  const handleReset = () => {
    setFormData({ ...initialFormData });
    setFileList([]);
    setShowPolicyError(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra các trường bắt buộc
    if (
      !formData.workingRegion ||
      !formData.employeeGroup ||
      !formData.hubSName.trim() ||
      !formData.affectedEntity
    ) {
      message.error("Vui lòng điền đầy đủ các trường bắt buộc.");
      return;
    }

    if (formData.incidentDescription.trim().length < 10) {
      message.error("Vui lòng mô tả sự vụ (tối thiểu 10 ký tự).");
      return;
    }

    if (!formData.agreePolicy) {
      setShowPolicyError(true);
      document.getElementById("agreePolicy")?.focus();
      return;
    }

    setShowPolicyError(false);
    setSubmitting(true);

    try {
      // 1. Tải bằng chứng lên Storage (bucket riêng tư "evidence")
      const folder = crypto.randomUUID();
      const evidencePaths = [];

      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i].originFileObj;
        if (!file) continue;

        const ext = (file.name.split(".").pop() || "bin").toLowerCase();
        const path = `${folder}/${i + 1}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("evidence")
          .upload(path, file, { contentType: file.type });

        if (uploadError) throw uploadError;
        evidencePaths.push(path);
      }

      // 2. Lưu báo cáo vào bảng reports
      const { error } = await supabase.from("reports").insert([
        {
          working_region: formData.workingRegion,
          employee_group: formData.employeeGroup,
          hub_name: formData.hubSName.trim(),
          affected_entity: formData.affectedEntity,
          incident_description: formData.incidentDescription.trim(),
          evidence_paths: evidencePaths,
          contact_info: formData.contactInfo.trim() || null,
        },
      ]);

      if (error) throw error;

      message.success("Báo cáo sự vụ của bạn đã được gửi thành công!");
      handleReset();
    } catch (err) {
      console.error(err);
      const msg = err?.message || "";
      if (msg.includes("RATE_LIMIT_CONTACT")) {
        message.error(
          "Thông tin liên hệ này đã gửi tối đa 5 báo cáo trong 24 giờ. Vui lòng thử lại sau.",
        );
      } else if (msg.includes("RATE_LIMIT_GLOBAL")) {
        message.error(
          "Hệ thống đang nhận quá nhiều báo cáo, vui lòng thử lại sau ít phút.",
        );
      } else {
        message.error("Gửi thất bại, vui lòng thử lại.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="spx-page-bg">
      <div className="spx-container">
        {/* BANNER HEADER */}
        <div className="spx-card banner-card">
          <img
            src="https://storage.googleapis.com/coreint-public-live/tangram-be/live/f868d1091daf4d41bd73f30e8cdd9a4b-1749185185.10853-Anonymous%20report%20banner.png"
            alt="SPX Express Kênh Tiếp Nhận Khiếu Nại Và Tố Cáo Sự Vụ"
            className="spx-banner-img"
          />
        </div>
        {/* NỘI DUNG HƯỚNG DẪN */}
        <div className="spx-body">
          <div className="spx-card content-card">
            <h1 className="spx-main-title">
              [SPX–VN] KÊNH TIẾP NHẬN BÁO CÁO SỰ VỤ
            </h1>

            <p className="spx-text">
              Đây là kênh báo cáo chính thức các sự vụ{" "}
              <strong>gian lận/trục lợi/vi phạm chính sách nội bộ</strong> dành
              cho <strong>SPX</strong>.
            </p>

            <p className="spx-text">
              Để đảm bảo thông tin báo cáo được tiếp nhận và xử lý hiệu quả bởi
              đúng bộ phận chuyên trách, vui lòng{" "}
              <strong>đọc kỹ hướng dẫn</strong> bên dưới:
            </p>

            <h3 className="spx-section-heading">
              1. Sử dụng Kênh báo cáo phù hợp:
            </h3>

            <table className="spx-table">
              <thead>
                <tr>
                  <th>Nội dung báo cáo</th>
                  <th>Kênh báo cáo</th>
                  <th>Đối tượng sử dụng</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>
                    - Gian lận/Trục lợi
                    <br />
                    - Lạm dụng/chiếm đoạt hàng hóa hoặc tài sản
                    <br />- Vi phạm chính sách nội bộ/bảo mật thông tin
                  </td>
                  <td>
                    Kênh{" "}
                    <a
                      href="https://spx-react-function.vercel.app/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      TIẾP NHẬN BÁO CÁO SỰ VỤ
                    </a>
                  </td>
                  <td>
                    - Nhân viên nội bộ SPX
                    <br />- Lao động thuê ngoài: BPO/OS…
                  </td>
                </tr>

                <tr>
                  <td>
                    - Môi trường làm việc (cư xử không đúng mực, quấy rối,...)
                  </td>
                  <td>
                    Kênh{" "}
                    <a
                      href="https://tinyurl.com/h9573sb9"
                      target="_blank"
                      rel="noreferrer"
                    >
                      VN - Suggestion Form
                    </a>
                  </td>
                  <td>Nhân viên nội bộ SPX</td>
                </tr>

                <tr>
                  <td>
                    - Hành vi gây nguy hại đến an toàn lao động hoặc môi trường
                  </td>
                  <td>
                    Kênh{" "}
                    <a
                      href="https://tinyurl.com/ynfp52xj"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Báo cáo Mối nguy, sự cố & Đề xuất an toàn
                    </a>
                  </td>
                  <td>
                    - Nhân viên nội bộ SPX
                    <br />
                    - Lao động thuê ngoài: BPO/OS…
                    <br />- Nhà thầu, Khách hàng…
                  </td>
                </tr>

                <tr>
                  <td>- Phản ánh chất lượng nhà thầu cung ứng lao động</td>
                  <td>
                    Kênh{" "}
                    <a
                      href="https://spx.vn/lp/olm-ghi-nhan-khieu-nai-nha-thau/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Phản ánh chất lượng nhà thầu
                    </a>
                  </td>
                  <td>
                    - OS/BPO/S-BPO/I-BPO đang làm việc tại các Hub/SOC của SPX
                  </td>
                </tr>
              </tbody>
            </table>

            <h3 className="spx-section-heading spx-section-heading--wide">
              2. Hướng dẫn cung cấp thông tin báo cáo:
            </h3>

            <ul className="spx-list">
              <li>
                <strong> - Mô tả chi tiết, rõ ràng</strong> về sự vụ, bao gồm:
                thời gian, địa điểm cụ thể xảy ra sự vụ, các cá nhân liên quan
                và vai trò của họ.
              </li>
              <li>
                - Ghi rõ họ tên, email, bộ phận của người bị tố cáo/ các cá nhân
                liên quan đến sự vụ.
              </li>
              <li>
                - Đính kèm <strong className="text-red">BẰNG CHỨNG</strong> (đây
                là cơ sở <strong>QUAN TRỌNG</strong> để bộ phận chuyên trách
                đánh giá xử lý điều tra).
              </li>
              <li>
                - Khuyến khích người tố cáo để lại{" "}
                <strong>thông tin liên hệ</strong> để team chuyên trách trao đổi
                nếu cần thêm thông tin.
              </li>
              <li>
                <strong className="text-red"> - KHÔNG NÊN</strong>: cung cấp
                thông tin mơ hồ, suy đoán cảm tính hoặc không đề cập danh tính
                người bị tố cáo/người vi phạm.
              </li>
            </ul>

            <h3 className="spx-section-heading">3. Nguyên tắc chung:</h3>

            <div className="spx-principles">
              <p>
                <strong>a) Nguyên tắc điều tra:</strong> Tất cả các báo cáo đều
                được xem xét kỹ lưỡng và sẽ thực hiện điều tra cẩn trọng nếu có
                đầy đủ thông tin cần thiết.
              </p>

              <p>
                <strong>b) Nguyên tắc bảo mật:</strong> Người tố cáo và các bộ
                phận tiếp nhận báo cáo có trách nhiệm giữ bí mật về danh tính
                của các cá nhân liên quan và toàn bộ nội dung sự vụ. Việc tiết
                lộ bất kỳ thông tin nào khi chưa được sự cho phép từ cấp trên và
                bộ phận liên quan được xem như hành vi vi phạm chính sách Bảo
                mật thông tin.
              </p>

              <p>
                <strong>c) Nguyên tắc chống trả thù:</strong> Người tố cáo và
                các bên tham gia điều tra được bảo vệ khỏi các hành vi trả thù
                theo chính sách chung của công ty.
              </p>

              <p>
                <strong>d) Nguyên tắc trung thực:</strong> Nội dung tố cáo phải
                đảm bảo đầy đủ, trung thực và khách quan, mọi hành vi vu khống
                hoặc trả thù ác ý sẽ được xử lý theo chính sách hiện hành.
              </p>
            </div>

            <hr className="spx-divider" />
          </div>
        </div>
        {/* FORM NHẬP THÔNG TIN */}
        <div className="spx-form-container">
          <form onSubmit={handleSubmit}>
            <h2 className="spx-form-header">THÔNG TIN CƠ BẢN</h2>

            <div className="spx-form-group">
              <label htmlFor="workingRegion" className="spx-label required">
                Bạn đang làm việc tại khu vực nào?
              </label>

              <Select
                id="workingRegion"
                className="spx-select"
                value={formData.workingRegion || undefined}
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    workingRegion: value,
                  }))
                }
                showSearch={{
                  optionFilterProp: "label",
                  filterOption: (input, option) =>
                    normalizeSearchText(option?.label ?? "").includes(
                      normalizeSearchText(input),
                    ),
                }}
                options={[
                  { value: "ha_noi", label: "Hà Nội" },
                  { value: "ho_chi_minh", label: "Hồ Chí Minh" },
                  { value: "mien_bac", label: "Miền Bắc" },
                  { value: "mien_trung", label: "Miền Trung" },
                  { value: "mien_nam", label: "Miền Nam" },
                ]}
                style={{ width: "100%" }}
              />
            </div>

            <div className="spx-form-group">
              <label htmlFor="employeeGroup" className="spx-label required">
                Bạn thuộc nhóm nhân viên nào dưới đây?
              </label>

              <Select
                id="employeeGroup"
                className="spx-select"
                value={formData.employeeGroup || undefined}
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    employeeGroup: value,
                  }))
                }
                showSearch={{
                  optionFilterProp: "label",
                  filterOption: (input, option) =>
                    normalizeSearchText(option?.label ?? "").includes(
                      normalizeSearchText(input),
                    ),
                }}
                options={[
                  {
                    value: "tai_xe_giao_nhan",
                    label: "Tài xế giao nhận hàng (Rider)",
                  },
                  {
                    value: "tai_xe_tai",
                    label: "Tài xế xe tải (Driver)",
                  },
                  {
                    value: "nhan_vien_van_hanh",
                    label: "Nhân viên vận hành (FTE Hub/SOC/LH)",
                  },
                  {
                    value: "nhan_vien_thoi_vu",
                    label: "Nhân viên thời vụ (BPO/OS)",
                  },
                ]}
                style={{ width: "100%" }}
              />
            </div>

            <div className="spx-form-group">
              <label htmlFor="hubSName" className="spx-label required">
                Tên gọi đầy đủ của Hub/SOC hay khu vực nơi bạn làm việc
              </label>

              <Input
                id="hubSName"
                type="text"
                name="hubSName"
                value={formData.hubSName}
                onChange={handleChange}
                maxLength={200}
                placeholder="Hướng dẫn: Vui lòng điền tối thiểu 04 ký tự tên gọi của Hub/SOC để hiện thị danh sách chọn"
              />
            </div>

            <h2 className="spx-form-header2">KHIẾU NẠI/TỐ CÁO SỰ VỤ</h2>

            <div className="spx-form-group">
              <label htmlFor="affectedEntity" className="spx-label required">
                Sự vụ này ảnh hưởng tới tổ chức/cá nhân nào?
              </label>

              <Select
                id="affectedEntity"
                className="spx-select"
                placeholder="Công ty SPX/Cá nhân"
                value={formData.affectedEntity || undefined}
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    affectedEntity: value,
                  }))
                }
                showSearch={{
                  optionFilterProp: "label",
                  filterOption: (input, option) =>
                    normalizeSearchText(option?.label ?? "").includes(
                      normalizeSearchText(input),
                    ),
                }}
                options={[
                  {
                    value: "cong_ty_spx",
                    label: "Công ty SPX",
                  },
                  {
                    value: "ca_nhan",
                    label: "Cá nhân",
                  },
                ]}
                style={{ width: "100%" }}
                aria-required="true"
              />
            </div>

            {/* MÔ TẢ SỰ VỤ */}
            <div className="spx-form-group">
              <label
                htmlFor="incidentDescription"
                className="spx-label required"
              >
                Mô tả chi tiết sự vụ
              </label>

              <Input.TextArea
                id="incidentDescription"
                name="incidentDescription"
                value={formData.incidentDescription}
                onChange={handleChange}
                rows={6}
                maxLength={5000}
                showCount
                placeholder="Nêu rõ thời gian, địa điểm, các cá nhân liên quan (họ tên, email, bộ phận) và diễn biến sự vụ."
              />
            </div>

            {/* ĐÍNH KÈM BẰNG CHỨNG */}
            <div className="spx-form-group">
              <label className="spx-label">
                Đính kèm bằng chứng (tối đa {MAX_FILES} tệp, mỗi tệp ≤ 10MB)
              </label>

              <Upload
                multiple
                maxCount={MAX_FILES}
                fileList={fileList}
                accept=".jpg,.jpeg,.png,.webp,.mp4,.mov,.pdf,.docx,.xlsx"
                beforeUpload={(file) => {
                  if (file.size > MAX_FILE_SIZE) {
                    message.error(`"${file.name}" vượt quá 10MB.`);
                    return Upload.LIST_IGNORE;
                  }
                  return false; // không tự upload, sẽ tải lên khi bấm Gửi
                }}
                onChange={({ fileList: newList }) => setFileList(newList)}
              >
                <Button htmlType="button">Chọn tệp bằng chứng</Button>
              </Upload>
              <p className="spx-subtext">
                Hỗ trợ ảnh (JPG, PNG, WEBP), video (MP4, MOV), PDF, Word, Excel.
              </p>
            </div>

            <h2 className="spx-form-header">THÔNG TIN LIÊN HỆ</h2>

            <div className="spx-form-group">
              <label htmlFor="contactInfo" className="spx-label">
                Trường hợp công ty muốn có thêm thông tin chi tiết, công ty có
                thể liên hệ với bạn không?
              </label>

              <Input
                id="contactInfo"
                name="contactInfo"
                type="text"
                value={formData.contactInfo}
                onChange={handleChange}
                maxLength={300}
                placeholder="Họ tên, số điện thoại hoặc email (không bắt buộc)"
              />
              <p className="spx-subtext">
                Tất cả thông tin bạn cung cấp đều được bảo vệ một cách nghiêm
                ngặt và bảo mật nhất. Công ty sẽ điều tra khách quan, công bằng,
                kịp thời và tôn trọng tất cả các bên liên quan. Tất cả những
                người cung cấp thông tin sẽ được bảo vệ chống lại bất kỳ sự trả
                đũa nào, với danh tính của họ được giữ bí mật tuyệt đối.
              </p>

              <hr className="spx-divider" />
            </div>

            {/* CHÍNH SÁCH BẢO MẬT */}
            <h3 className="spx-policy-header">
              Chính sách bảo mật thông tin của SPX Express
            </h3>

            <div className="spx-form-group">
              <p className="spx-label required policy-intro">
                Cảm ơn bạn đã hoàn thành biểu mẫu khiếu nại/tố cáo sự vụ. Trước
                khi bạn gửi thông tin, vui lòng đọc và xác nhận điều khoản bên
                dưới:
              </p>

              <div className="spx-checkbox-container">
                <Checkbox
                  id="agreePolicy"
                  name="agreePolicy"
                  checked={formData.agreePolicy}
                  onChange={handleChange}
                  aria-invalid={showPolicyError}
                  aria-describedby={
                    showPolicyError ? "policy-error" : undefined
                  }
                >
                  <span className="spx-checkbox-label">
                    Tôi xác nhận rằng Tôi đã hiểu và đồng ý với Chính sách bảo
                    mật của SPX Express và đồng ý toàn bộ cho công ty được tiến
                    hành xử lý dữ liệu cá nhân của tôi phù hợp với các quy định
                    trong Chính sách bảo mật của công ty.
                  </span>
                </Checkbox>
              </div>

              {showPolicyError && (
                <p id="policy-error" className="spx-policy-error" role="alert">
                  Vui lòng đọc kỹ và xác nhận điều khoản này
                </p>
              )}

              <p className="spx-subtext">
                Tất cả thông tin nhận được sẽ được bảo vệ một cách nghiêm ngặt
                và bảo mật nhất, và tất cả những người cung cấp thông tin sẽ
                được bảo vệ chống lại bất kỳ sự trả đũa nào, với danh tính của
                họ được giữ bí mật tuyệt đối.
              </p>
            </div>

            <hr className="spx-divider" />
            {/* NÚT THAO TÁC */}
            <div className="spx-action-buttons">
              <Button
                htmlType="button"
                size="large"
                className="btn-reset"
                onClick={handleReset}
                disabled={submitting}
              >
                Xoá thông tin đã điền
              </Button>

              <Button
                type="primary"
                htmlType="submit"
                size="large"
                className="btn-submit"
                loading={submitting}
              >
                Gửi tố cáo
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
