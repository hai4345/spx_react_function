import { useState } from "react";
import "./App.css";

export default function SPXReportForm() {
  const initialFormData = {
    workingRegion: "",
    employeeGroup: "",
    hubSName: "",
    affectedEntity: "",
    contactInfo: "",
    agreePolicy: false,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [showPolicyError, setShowPolicyError] = useState(false);

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
    setShowPolicyError(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.agreePolicy) {
      setShowPolicyError(true);
      document.getElementById("agreePolicy")?.focus();
      return;
    }

    setShowPolicyError(false);

    console.log("Dữ liệu tố cáo:", formData);
    alert("Báo cáo sự vụ của bạn đã được gửi thành công!");
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
                      href="https://spx.vn/lp/spx-risk-form-bao-cao-an-danh/"
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
                <strong>Mô tả chi tiết, rõ ràng</strong> về sự vụ, bao gồm: thời
                gian, địa điểm cụ thể xảy ra sự vụ, các cá nhân liên quan và vai
                trò của họ.
              </li>
              <li>
                Ghi rõ họ tên, email, bộ phận của người bị tố cáo/ các cá nhân
                liên quan đến sự vụ.
              </li>
              <li>
                Đính kèm <strong className="text-red">BẰNG CHỨNG</strong> (đây
                là cơ sở <strong>QUAN TRỌNG</strong> để bộ phận chuyên trách
                đánh giá xử lý điều tra).
              </li>
              <li>
                Khuyến khích người tố cáo để lại{" "}
                <strong>thông tin liên hệ</strong> để team chuyên trách trao đổi
                nếu cần thêm thông tin.
              </li>
              <li>
                <strong className="text-red">KHÔNG NÊN</strong>: cung cấp thông
                tin mơ hồ, suy đoán cảm tính hoặc không đề cập danh tính người
                bị tố cáo/người vi phạm.
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

              <select
                id="workingRegion"
                name="workingRegion"
                value={formData.workingRegion}
                onChange={handleChange}
                className="spx-input"
                required
              >
                <option value="">Vui lòng chọn khu vực</option>
                <option value="mien_bac">Miền Bắc</option>
                <option value="mien_trung">Miền Trung</option>
                <option value="mien_nam">Miền Nam</option>
                <option value="kho_soc">Hệ thống Kho / SOC</option>
                <option value="van_phong">Khối Văn Phòng (HO)</option>
              </select>
            </div>

            <div className="spx-form-group">
              <label htmlFor="employeeGroup" className="spx-label required">
                Bạn thuộc nhóm nhân viên nào dưới đây?
              </label>

              <select
                id="employeeGroup"
                name="employeeGroup"
                value={formData.employeeGroup}
                onChange={handleChange}
                className="spx-input"
                required
              >
                <option value="">Vui lòng chọn nhóm nhân viên</option>
                <option value="noi_bo">Nhân viên nội bộ SPX</option>
                <option value="bpo_os">Lao động thuê ngoài (BPO / OS)</option>
                <option value="nha_thau">Nhà thầu / Đối tác</option>
                <option value="khac">Khác</option>
              </select>
            </div>

            <div className="spx-form-group">
              <label htmlFor="hubSName" className="spx-label required">
                Tên gọi đầy đủ của Hub/SOC hay khu vực nơi bạn làm việc
              </label>

              <input
                id="hubSName"
                type="text"
                name="hubSName"
                value={formData.hubSName}
                onChange={handleChange}
                placeholder="Vui lòng điền tên gọi của Hub/SOC"
                className="spx-input"
                minLength={4}
                required
              />
            </div>

            <h2 className="spx-form-header">KHIẾU NẠI/TỐ CÁO SỰ VỤ</h2>

            <div className="spx-form-group">
              <label htmlFor="affectedEntity" className="spx-label required">
                Sự vụ này ảnh hưởng tới tổ chức/cá nhân nào?
              </label>

              <select
                id="affectedEntity"
                name="affectedEntity"
                value={formData.affectedEntity}
                onChange={handleChange}
                className="spx-input"
                required
              >
                <option value="">Vui lòng chọn</option>
                <option value="spx">Công ty SPX</option>
                <option value="ca_nhan">Cá nhân</option>
              </select>
            </div>

            <h2 className="spx-form-header">THÔNG TIN LIÊN HỆ</h2>

            <div className="spx-form-group">
              <label htmlFor="contactInfo" className="spx-label">
                Trường hợp công ty muốn có thêm thông tin chi tiết, công ty có
                thể liên hệ với bạn không?
              </label>

              <input
                id="contactInfo"
                type="text"
                name="contactInfo"
                value={formData.contactInfo}
                onChange={handleChange}
                placeholder="Vui lòng để lại số điện thoại, hoặc email tại đây"
                className="spx-input"
              />

              <p className="spx-subtext">
                Tất cả thông tin bạn cung cấp đều được bảo vệ một cách nghiêm
                ngặt và bảo mật nhất. Công ty sẽ điều tra khách quan, công bằng,
                kịp thời và tôn trọng tất cả các bên liên quan. Tất cả những
                người cung cấp thông tin sẽ được bảo vệ chống lại bất kỳ sự trả
                đũa nào, với danh tính của họ được giữ bí mật tuyệt đối.
              </p>
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
                <input
                  type="checkbox"
                  id="agreePolicy"
                  name="agreePolicy"
                  checked={formData.agreePolicy}
                  onChange={handleChange}
                  className="spx-checkbox"
                  aria-invalid={showPolicyError}
                  aria-describedby={
                    showPolicyError ? "policy-error" : undefined
                  }
                />

                <label htmlFor="agreePolicy" className="spx-checkbox-label">
                  Tôi xác nhận rằng Tôi đã hiểu và đồng ý với Chính sách bảo mật
                  của SPX Express và đồng ý toàn bộ cho công ty được tiến hành
                  xử lý dữ liệu cá nhân của tôi phù hợp với các quy định trong
                  Chính sách bảo mật của công ty.
                </label>
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

            {/* NÚT THAO TÁC */}
            <div className="spx-action-buttons">
              <button
                type="button"
                onClick={handleReset}
                className="spx-btn btn-reset"
              >
                Xoá thông tin đã điền
              </button>
              <button type="submit" className="spx-btn btn-submit">
                Gửi tố cáo
              </button>
            </div>
          </form>
        </div>Í
      </div>
    </div>
  );
}
