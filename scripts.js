/* =========================================================
   Louis Wu — Portfolio Scripts
   ========================================================= */

const langSwitchButton = document.getElementById('lang-switch');
const langSwitchLabel = document.getElementById('lang-switch-label');
const bodyElement = document.body;
const htmlElement = document.documentElement;
let currentLang = 'en';

/* ---------------- Project Detail Registry ---------------- */
const PROJECTS = {
  'moe-dugan': {
    en: {
      period: '2024 – Present',
      title: 'MoE-DUGAN: Generative Denoising for Low-Dose CT',
      org: 'Lab of AI & Computer Vision · NTUST',
      tags: ['PyTorch', 'GAN', 'DDPM', 'Mixture of Experts', 'Medical Imaging'],
      summary:
        'A research project extending Dual-Discriminator GANs with a Mixture-of-Experts adaptive loss-weighting module for multi-modal medical image denoising (CT / MRI / Ultrasound).',
      sections: [
        {
          heading: 'Highlights',
          bullets: [
            'Designed the MoE-DUGAN framework extending Dual-Discriminator GANs for Low-Dose CT (LDCT) denoising.',
            'Implemented a “Noise Expert” module (Mixture of Experts) that dynamically adjusts adversarial loss weights across modalities.',
            'Validated on multi-modal datasets including CT, MRI, and Ultrasound to assess generalization.',
          ],
        },
        {
          heading: 'Tech Stack',
          stack: ['PyTorch', 'Residual Denoising', 'DDPM (Diffusion Models)', 'Probability Simulation', 'Machine Learning'],
        },
      ],
    },
    zh: {
      period: '2024年 – 至今',
      title: 'MoE-DUGAN：低劑量 CT 生成式去雜訊',
      org: 'AI 與電腦視覺實驗室 · NTUST',
      tags: ['PyTorch', 'GAN', 'DDPM', 'Mixture of Experts', '醫學影像'],
      summary:
        '延伸 Dual-Discriminator GANs，加入 Mixture-of-Experts 動態調整對抗式 loss 權重的模組，應用於多模態醫學影像（CT / MRI / 超音波）去雜訊。',
      sections: [
        {
          heading: '研究亮點',
          bullets: [
            '設計 MoE-DUGAN 架構，延伸 Dual-Discriminator GANs 用於低劑量 CT（LDCT）去雜訊。',
            '實作「Noise Expert」模組（Mixture of Experts），在多模態資料間動態調整對抗式 loss 權重。',
            '在 CT、MRI、超音波等多模態資料上驗證模型泛化能力。',
          ],
        },
        {
          heading: '技術',
          stack: ['PyTorch', 'Residual Denoising', 'DDPM（擴散模型）', '機率模擬', '機器學習'],
        },
      ],
    },
  },

  'clinical-nlp': {
    en: {
      period: '2023 – Present',
      title: 'LLM-Guided Retrieval for Clinical Narratives (RAG)',
      org: 'Lab of Medical Imaging · NTUST',
      tags: ['PyTorch', 'RAG', 'LoRA', 'BioBERT', 'NLP'],
      summary:
        'A hybrid retrieval system for long-form clinical narratives, combining a chunked BioBERT retriever, sparse cross-chunk aggregation, and LLM-based equivalence judging for diagnosis re-ranking.',
      sections: [
        {
          heading: 'Highlights',
          bullets: [
            'Built a hybrid LLM-guided retrieval system for clinical narratives using a chunked BioBERT retriever with sparse cross-chunk aggregation.',
            'Improved the RAG pipeline by applying LLM-based equivalence judging for diagnosis re-ranking, enhancing search precision.',
          ],
        },
        {
          heading: 'Conference',
          bullets: [
            'Oral & Poster presentation at the 2025 IPAS Conference (NTUST × Yonsei University).',
          ],
        },
        {
          heading: 'Tech Stack',
          stack: ['PyTorch', 'Hugging Face Transformers', 'RAG', 'LoRA', 'NLP', 'Machine Learning'],
        },
      ],
    },
    zh: {
      period: '2023年 – 至今',
      title: '長篇臨床敘述的 LLM 導引檢索（RAG）',
      org: '醫學影像實驗室 · NTUST',
      tags: ['PyTorch', 'RAG', 'LoRA', 'BioBERT', 'NLP'],
      summary:
        '針對長篇臨床敘述設計的混合式檢索系統：以分段 BioBERT 檢索器搭配稀疏跨片段聚合，並以 LLM 等價判定器進行診斷重排序。',
      sections: [
        {
          heading: '研究亮點',
          bullets: [
            '建置長篇臨床敘述的混合式 LLM 導引檢索系統：以分段 BioBERT 檢索器搭配稀疏跨片段聚合。',
            '以 LLM 等價判定器進行診斷重排序，改善 RAG 檢索精度。',
          ],
        },
        {
          heading: '會議發表',
          bullets: [
            '2025 IPAS Conference（國立臺灣科技大學 × 延世大學）口頭與海報發表。',
          ],
        },
        {
          heading: '技術',
          stack: ['PyTorch', 'Hugging Face Transformers', 'RAG', 'LoRA', 'NLP', '機器學習'],
        },
      ],
    },
  },

  'emg': {
    en: {
      period: '2025',
      title: 'EMG Signal Prediction',
      org: 'Independent Project',
      tags: ['CNN+GRU', 'MediaPipe', 'Real-time', 'Bio-signal'],
      summary:
        'Low-latency EMG signal processing for grasp-strength estimation. Spectrogram-based 2D CNN sliding window + GRU pipeline, fused with MediaPipe pose data.',
      sections: [
        {
          heading: 'Highlights',
          bullets: [
            'Converted EMG signals into spectrograms for 2D CNN sliding-window analysis.',
            'Combined CNN feature extraction with a GRU temporal model.',
            'Integrated MediaPipe to fuse vision-based hand pose information with EMG estimates.',
            'Achieved low-latency, real-time grasp-strength prediction.',
          ],
        },
      ],
    },
    zh: {
      period: '2025',
      title: 'EMG 訊號預測',
      org: '個人專案',
      tags: ['CNN+GRU', 'MediaPipe', '即時', '生醫訊號'],
      summary:
        'EMG 訊號處理：將訊號轉成頻譜圖，搭配 2D CNN 滑動窗 + GRU，並與 MediaPipe 視覺資料融合，達成低延遲手部抓握力道判斷。',
      sections: [
        {
          heading: '研究亮點',
          bullets: [
            '將 EMG 訊號轉成頻譜圖，使用 2D CNN 滑動窗進行特徵抽取。',
            '結合 CNN 特徵與 GRU 時序模型進行預測。',
            '整合 MediaPipe，將手部姿態資訊與 EMG 估計融合。',
            '達成低延遲、即時的抓握力道預測。',
          ],
        },
      ],
    },
  },

  'brain-tumor': {
    en: {
      period: '2024',
      title: 'Optimized Model for Brain Tumor Segmentation',
      org: 'Independent Project',
      tags: ['U-Net', 'Segmentation', 'PyTorch'],
      summary:
        'Customized dataset and data loader applied to a U-Net pipeline for brain tumor segmentation.',
      sections: [
        {
          heading: 'Highlights',
          bullets: [
            'Built a customized dataset and data loader to handle medical imaging formats.',
            'Applied U-Net architecture for tumor segmentation with optimized training pipeline.',
          ],
        },
      ],
    },
    zh: {
      period: '2024',
      title: '腦瘤分割最佳化模型',
      org: '個人專案',
      tags: ['U-Net', '影像分割', 'PyTorch'],
      summary:
        '自訂資料集與 data loader，應用於 U-Net 腦瘤分割。',
      sections: [
        {
          heading: '研究亮點',
          bullets: [
            '建置自訂資料集與 data loader，處理醫學影像格式。',
            '使用 U-Net 架構進行腫瘤分割，並優化訓練流程。',
          ],
        },
      ],
    },
  },

  'bci': {
    en: {
      period: '2024',
      title: 'Brain-Computer Interface Research Group',
      org: 'NTUST',
      tags: ['EEG', 'Reading Group'],
      summary: 'EEG reading group and literature sharing focused on brain-computer interface research.',
      sections: [
        { heading: 'Highlights', bullets: ['Led & participated in EEG reading group sessions.', 'Shared literature reviews on BCI methods and applications.'] },
      ],
    },
    zh: {
      period: '2024',
      title: '腦機介面研究小組',
      org: 'NTUST',
      tags: ['EEG', '讀書會'],
      summary: '針對腦機介面研究的 EEG 讀書會與文獻分享。',
      sections: [
        { heading: '亮點', bullets: ['主持及參與 EEG 讀書會。', '分享 BCI 方法與應用的文獻回顧。'] },
      ],
    },
  },

  'solidworks': {
    en: {
      period: '2023',
      title: 'SolidWorks Educational Videos',
      org: 'NTU Racing Team',
      tags: ['SolidWorks', 'Simulation', 'Teaching'],
      summary: 'Teaching stress simulation and topology optimization to NTU Racing Team structural members.',
      sections: [
        { heading: 'Highlights', bullets: ['Produced educational videos on stress simulation.', 'Covered topology optimization workflows for chassis components.'] },
      ],
    },
    zh: {
      period: '2023',
      title: 'SolidWorks 教學影片',
      org: '台大賽車隊',
      tags: ['SolidWorks', '模擬', '教學'],
      summary: '教授應力模擬與拓撲優化給 NTU 賽車隊結構組員。',
      sections: [
        { heading: '亮點', bullets: ['製作應力模擬教學影片。', '涵蓋車架元件拓撲優化流程。'] },
      ],
    },
  },

  'blind-cane': {
    en: {
      period: '2022',
      title: 'AI-Powered Blind Cane',
      org: 'Independent Project',
      tags: ['Raspberry Pi', 'Image Recognition', 'Embedded'],
      summary: 'Built an assistive cane using Raspberry Pi with onboard image recognition.',
      sections: [
        { heading: 'Highlights', bullets: ['Used Raspberry Pi as the processing core.', 'Integrated image recognition for obstacle awareness.'] },
      ],
    },
    zh: {
      period: '2022',
      title: '智慧導盲杖',
      org: '個人專案',
      tags: ['Raspberry Pi', '影像辨識', '嵌入式'],
      summary: '使用 Raspberry Pi 為核心，搭載影像辨識功能。',
      sections: [
        { heading: '亮點', bullets: ['以 Raspberry Pi 作為處理核心。', '整合影像辨識以提示障礙物。'] },
      ],
    },
  },

  'iot-fridge': {
    en: {
      period: '2022',
      title: 'IoT Refrigerator',
      org: 'Independent Project',
      tags: ['IoT', 'Thermoelectric', 'Embedded'],
      summary: 'Compact refrigerator with remote monitoring and thermoelectric cooling.',
      sections: [
        { heading: 'Highlights', bullets: ['Designed thermoelectric cooling subsystem.', 'Added remote monitoring of internal temperature.'] },
      ],
    },
    zh: {
      period: '2022',
      title: 'IoT 冰箱',
      org: '個人專案',
      tags: ['IoT', '熱電致冷', '嵌入式'],
      summary: '具遠端監控與熱電致冷功能的小型冰箱。',
      sections: [
        { heading: '亮點', bullets: ['設計熱電致冷子系統。', '加入遠端內部溫度監控。'] },
      ],
    },
  },

  'rc-plane': {
    en: {
      period: '2022',
      title: 'Remote-Controlled Airplane',
      org: 'Independent Project',
      tags: ['Arduino', 'SolidWorks', 'Mechanical'],
      summary: 'Designed and built an RC airplane using Arduino and SolidWorks.',
      sections: [
        { heading: 'Highlights', bullets: ['Modeled airframe in SolidWorks.', 'Used Arduino for flight control electronics.'] },
      ],
    },
    zh: {
      period: '2022',
      title: '遙控飛機',
      org: '個人專案',
      tags: ['Arduino', 'SolidWorks', '機械'],
      summary: '使用 Arduino 與 SolidWorks 製作的遙控飛機。',
      sections: [
        { heading: '亮點', bullets: ['以 SolidWorks 建模機身。', '使用 Arduino 製作飛控電子。'] },
      ],
    },
  },

  'ev-bike': {
    en: {
      period: '2024',
      title: 'Electric Bicycle',
      org: 'Independent Project',
      tags: ['EV', 'Mechanical', 'Power Electronics'],
      summary: 'Designed and built an electric bicycle independently.',
      sections: [
        { heading: 'Highlights', bullets: ['Designed mechanical and electrical systems end-to-end.', 'Independently sourced and integrated components.'] },
      ],
    },
    zh: {
      period: '2024',
      title: '電動自行車',
      org: '個人專案',
      tags: ['電動車', '機械', '電力電子'],
      summary: '自行設計與製作的電動自行車。',
      sections: [
        { heading: '亮點', bullets: ['全程設計機械與電氣系統。', '自行採購與整合零組件。'] },
      ],
    },
  },

  'mediatek': {
    en: {
      period: '2019',
      title: 'MediaTek Funded Science Fair Project',
      org: 'High School',
      tags: ['Science Fair', 'Funded'],
      summary: 'Participated in a science fair project with full funding from MediaTek.',
      sections: [
        { heading: 'Highlights', bullets: ['Awarded full project funding from MediaTek.', 'Presented project at the science fair.'] },
      ],
    },
    zh: {
      period: '2019',
      title: '聯發科補助科展專案',
      org: '高中',
      tags: ['科展', '補助'],
      summary: '獲聯發科全額補助，參與科學展覽。',
      sections: [
        { heading: '亮點', bullets: ['獲聯發科全額專案補助。', '於科學展覽中發表專案。'] },
      ],
    },
  },
};

const AWARDS = {
  'coding-101': {
    en: {
      period: 'Top 5',
      title: 'Coding 101',
      org: 'Coding101 / Programming Literacy Initiative',
      tags: ['Top 5', 'Programming Competition', 'Software Collaboration'],
      summary: 'Placed fifth in Coding 101, a competition centered on programming literacy, collaborative software creation, and practical implementation.',
      sections: [
        {
          heading: 'What the competition is',
          bullets: [
            'Coding 101 is a programming competition designed to strengthen programming literacy, computational thinking, and collaborative software creation.',
            'Teams submit software work, explain key code and implementation choices, and are evaluated on originality, applicability, completeness, and engineering practice.',
          ],
        },
        {
          heading: 'My result',
          bullets: ['Top 5 finish.'],
        },
        {
          heading: 'Official page',
          links: [{ label: 'Coding 101 competition info', url: 'https://2025.coding101.tw/activities' }],
        },
      ],
    },
    zh: {
      period: '第五名',
      title: 'Coding 101',
      org: 'Coding101 / 程式素養競賽',
      tags: ['第五名', '程式競賽', '軟體協作'],
      summary: '在 Coding 101 取得第五名。這是一場以程式素養、協作開發與實作能力為主軸的程式競賽。',
      sections: [
        {
          heading: '比賽在做什麼',
          bullets: [
            'Coding 101 旨在強化程式素養、運算思維，以及團隊協作進行軟體創作的能力。',
            '隊伍需要提交軟體作品、說明重點程式設計與實作方式，並依原創性、應用性、完成度與工程實踐等面向評分。',
          ],
        },
        {
          heading: '我的成績',
          bullets: ['第五名。'],
        },
        {
          heading: '官方頁面',
          links: [{ label: 'Coding 101 競賽資訊', url: 'https://2025.coding101.tw/activities' }],
        },
      ],
    },
  },

  'metro-2025': {
    en: {
      period: '2025',
      title: 'Taipei Metro Hackathon (AI & UI/UX)',
      org: 'Taipei Rapid Transit Corporation',
      tags: ['3rd Place', 'AI', 'UI/UX', 'Prototype'],
      summary: 'Won third place by leading a cross-functional team and shipping an AI MVP around the Taipei Metro Go app experience.',
      sections: [
        {
          heading: 'What the competition is',
          bullets: [
            'An app-focused hackathon centered on AI enablement plus UI/UX redesign for the Taipei Metro Go app.',
            'Teams were evaluated on UI/UX design, content innovation, and prototype feasibility.',
          ],
        },
        {
          heading: 'My result',
          bullets: [
            'Third Place in 2025.',
            'Led the team through concept framing, execution, and deadline delivery.',
          ],
        },
        {
          heading: 'Official page',
          links: [{ label: '2025 Taipei Metro Hackathon', url: 'https://2025hackathon.metro.taipei/' }],
        },
      ],
    },
    zh: {
      period: '2025',
      title: '台北捷運黑客松（AI 與 UI/UX）',
      org: '臺北大眾捷運股份有限公司',
      tags: ['第三名', 'AI', 'UI/UX', 'Prototype'],
      summary: '獲得第三名，並帶領跨職能團隊完成一個圍繞台北捷運 Go App 體驗的 AI MVP。',
      sections: [
        {
          heading: '比賽在做什麼',
          bullets: [
            '這是一場以台北捷運 Go App 為核心的黑客松，主軸是 AI 賦能與 UI/UX 優化設計。',
            '評分重點涵蓋 UI/UX 設計、內容創新與原型可行性。',
          ],
        },
        {
          heading: '我的成績',
          bullets: [
            '2025 年第三名。',
            '負責帶隊、整合方向並在期限內完成可操作原型。',
          ],
        },
        {
          heading: '官方頁面',
          links: [{ label: '2025 捷運盃黑客松', url: 'https://2025hackathon.metro.taipei/' }],
        },
      ],
    },
  },

  'sustainability-2024': {
    en: {
      period: '2024',
      title: 'Sustainability Smart Innovation Hackathon',
      org: 'Sustainability Hackathon Taiwan',
      tags: ['Champion', 'SDGs', 'Enterprise Challenge'],
      summary: 'Won the championship in a sustainability-focused hackathon built around SDGs, resilience, and enterprise-backed problem statements.',
      sections: [
        {
          heading: 'What the competition is',
          bullets: [
            'A student hackathon guided by the UN Sustainable Development Goals.',
            'Teams respond to real enterprise problem statements with technology-enabled sustainable innovation proposals.',
          ],
        },
        {
          heading: 'My result',
          bullets: ['Champion.'],
        },
        {
          heading: 'Official page',
          links: [{ label: '2024 Sustainability Smart Innovation Hackathon', url: 'https://sustainabilityhackathon-tw.org/%E6%B0%B8%E7%BA%8C%E6%99%BA%E6%85%A7%E5%89%B5%E6%96%B0%E9%BB%91%E5%AE%A2%E6%9D%BE%E7%AB%B6%E8%B3%BD%E5%8D%B3%E5%B0%87%E6%8B%89%E9%96%8B%E5%BA%8F%E5%B9%95/' }],
        },
      ],
    },
    zh: {
      period: '2024',
      title: '永續智慧創新黑客松',
      org: '永續智慧創新黑客松競賽',
      tags: ['冠軍', 'SDGs', '企業命題'],
      summary: '在以 SDGs、韌性與企業命題為核心的永續黑客松中獲得冠軍。',
      sections: [
        {
          heading: '比賽在做什麼',
          bullets: [
            '競賽以聯合國 17 項永續發展目標為主軸，強調永續、智慧、創新與韌性。',
            '參賽者需針對企業提出的真實命題，發展具科技導向的永續創新方案。',
          ],
        },
        {
          heading: '我的成績',
          bullets: ['冠軍。'],
        },
        {
          heading: '官方頁面',
          links: [{ label: '2024 永續智慧創新黑客松', url: 'https://sustainabilityhackathon-tw.org/%E6%B0%B8%E7%BA%8C%E6%99%BA%E6%85%A7%E5%89%B5%E6%96%B0%E9%BB%91%E5%AE%A2%E6%9D%BE%E7%AB%B6%E8%B3%BD%E5%8D%B3%E5%B0%87%E6%8B%89%E9%96%8B%E5%BA%8F%E5%B9%95/' }],
        },
      ],
    },
  },

  'voc-2023': {
    en: {
      period: '2023',
      title: 'Vocational Cup Hackathon · Northern Preliminary',
      org: 'Ministry of Education Vocational Cup Hackathon',
      tags: ['Merit Award', 'Northern Preliminary', 'Makerthon'],
      summary: 'Received a Merit Award in the 2023 northern preliminary round.',
      sections: [
        {
          heading: 'What the competition is',
          bullets: [
            'A two-stage vocational college makerthon that asks teams to build prototypes on site under time pressure.',
            'The competition emphasizes technical execution, creativity, presentation, design, and value creation.',
          ],
        },
        {
          heading: 'My result',
          bullets: ['2023 Northern Preliminary · Merit Award.'],
        },
        {
          heading: 'Official page',
          links: [{ label: 'Vocational Cup Hackathon overview', url: 'https://competition.npust.edu.tw/competition/2024%E5%B9%B4%E6%8A%80%E8%81%B7%E7%9B%83%E9%BB%91%E5%AE%A2%E6%9D%BE%E7%AB%B6%E8%B3%BD/' }],
        },
      ],
    },
    zh: {
      period: '2023',
      title: '技職盃黑客松 · 北區初賽',
      org: '教育部技職盃黑客松競賽',
      tags: ['佳作', '北區初賽', 'Makerthon'],
      summary: '在 2023 年北區初賽獲得佳作。',
      sections: [
        {
          heading: '比賽在做什麼',
          bullets: [
            '這是一場兩階段的技職 Makerthon，參賽隊伍需要在現場限時完成作品原型。',
            '評分面向包含技術、創意、簡報、設計，以及創造價值。',
          ],
        },
        {
          heading: '我的成績',
          bullets: ['2023 北區初賽佳作。'],
        },
        {
          heading: '官方頁面',
          links: [{ label: '技職盃黑客松競賽說明', url: 'https://competition.npust.edu.tw/competition/2024%E5%B9%B4%E6%8A%80%E8%81%B7%E7%9B%83%E9%BB%91%E5%AE%A2%E6%9D%BE%E7%AB%B6%E8%B3%BD/' }],
        },
      ],
    },
  },

  'voc-2024-north': {
    en: {
      period: '2024',
      title: 'Vocational Cup Hackathon · 2024 Northern Regional',
      org: 'Ministry of Education Vocational Cup Hackathon',
      tags: ['Champion', 'Regional Winner', 'Makerthon'],
      summary: 'Won the championship in the 2024 northern regional round of the Vocational Cup Hackathon.',
      sections: [
        {
          heading: 'What the competition is',
          bullets: [
            'The 2024 edition used affordable clean energy as the competition theme.',
            'Projects could be hardware, web services, apps, mechatronics, or interactive systems, all built during the event.',
          ],
        },
        {
          heading: 'My result',
          bullets: ['2024 Northern Regional Champion.'],
        },
        {
          heading: 'Official page',
          links: [{ label: '2024 Vocational Cup Hackathon', url: 'https://competition.npust.edu.tw/competition/2024%E5%B9%B4%E6%8A%80%E8%81%B7%E7%9B%83%E9%BB%91%E5%AE%A2%E6%9D%BE%E7%AB%B6%E8%B3%BD/' }],
        },
      ],
    },
    zh: {
      period: '2024',
      title: '技職盃黑客松 · 2024 北區賽',
      org: '教育部技職盃黑客松競賽',
      tags: ['冠軍', '分區賽', 'Makerthon'],
      summary: '在 2024 技職盃黑客松拿下北區冠軍。',
      sections: [
        {
          heading: '比賽在做什麼',
          bullets: [
            '2024 年競賽主題聚焦於「可負擔的潔淨能源」，鼓勵學生用設計思考與實作解題。',
            '作品形式不限，可為實體作品、網頁服務、App、機電整合或互動機構，並於比賽現場完成。',
          ],
        },
        {
          heading: '我的成績',
          bullets: ['2024 北區冠軍。'],
        },
        {
          heading: '官方頁面',
          links: [{ label: '2024 技職盃黑客松', url: 'https://competition.npust.edu.tw/competition/2024%E5%B9%B4%E6%8A%80%E8%81%B7%E7%9B%83%E9%BB%91%E5%AE%A2%E6%9D%BE%E7%AB%B6%E8%B3%BD/' }],
        },
      ],
    },
  },

  'voc-2024-final': {
    en: {
      period: '2024',
      title: 'Vocational Cup Hackathon · 2024 National Final',
      org: 'Ministry of Education Vocational Cup Hackathon',
      tags: ['Best Value Creation', '2nd Overall', 'National Final'],
      summary: 'Received the Best Value Creation Award in the 2024 national final, corresponding to second overall.',
      sections: [
        {
          heading: 'What the competition is',
          bullets: [
            'The national final continues the same makerthon format but gathers top teams from multiple regions for the final round.',
            'Judging still emphasizes technical execution, creativity, design, presentation, and how much value the prototype can create.',
          ],
        },
        {
          heading: 'My result',
          bullets: ['2024 National Final Best Value Creation Award (2nd overall).'],
        },
        {
          heading: 'Official page',
          links: [{ label: '2024 Vocational Cup Hackathon', url: 'https://competition.npust.edu.tw/competition/2024%E5%B9%B4%E6%8A%80%E8%81%B7%E7%9B%83%E9%BB%91%E5%AE%A2%E6%9D%BE%E7%AB%B6%E8%B3%BD/' }],
        },
      ],
    },
    zh: {
      period: '2024',
      title: '技職盃黑客松 · 2024 全國決賽',
      org: '教育部技職盃黑客松競賽',
      tags: ['最佳創造價值', '總排名第二', '全國決賽'],
      summary: '在 2024 全國決賽獲得最佳創造價值獎，對應總排名第二。',
      sections: [
        {
          heading: '比賽在做什麼',
          bullets: [
            '全國決賽延續同樣的 Makerthon 架構，但集結各分區優勝隊伍進行最終競賽。',
            '評審仍重視技術完成度、創意、設計、簡報與作品能創造的實際價值。',
          ],
        },
        {
          heading: '我的成績',
          bullets: ['2024 全國決賽最佳創造價值獎（總排名第 2）。'],
        },
        {
          heading: '官方頁面',
          links: [{ label: '2024 技職盃黑客松', url: 'https://competition.npust.edu.tw/competition/2024%E5%B9%B4%E6%8A%80%E8%81%B7%E7%9B%83%E9%BB%91%E5%AE%A2%E6%9D%BE%E7%AB%B6%E8%B3%BD/' }],
        },
      ],
    },
  },

  'voc-2025-north': {
    en: {
      period: '2025',
      title: 'Vocational Cup Hackathon · 2025 Northern Regional',
      org: 'Ministry of Education Vocational Cup Hackathon',
      tags: ['Champion', 'Regional Winner', 'Makerthon'],
      summary: 'Won the championship in the 2025 northern regional round.',
      sections: [
        {
          heading: 'What the competition is',
          bullets: [
            'The 2025 edition kept the same core makerthon structure: topic reveal on site, live prototyping, and multi-dimensional judging.',
            'Official materials also explicitly allowed AI-assisted creation when accompanied by a disclosure statement.',
          ],
        },
        {
          heading: 'My result',
          bullets: ['2025 Northern Regional Champion.'],
        },
        {
          heading: 'Official page',
          links: [{ label: '2025 Vocational Cup Hackathon materials', url: 'https://www.lit.edu.tw/wp-content/uploads/2025/03/2025%E5%B9%B4%E6%8A%80%E8%81%B7%E7%9B%83%E9%BB%91%E5%AE%A2%E6%9D%BE%E7%AB%B6%E8%B3%BD%E6%B4%BB%E5%8B%95%E8%B3%87%E6%96%99.pdf' }],
        },
      ],
    },
    zh: {
      period: '2025',
      title: '技職盃黑客松 · 2025 北區賽',
      org: '教育部技職盃黑客松競賽',
      tags: ['冠軍', '分區賽', 'Makerthon'],
      summary: '2025 年再次拿下北區冠軍。',
      sections: [
        {
          heading: '比賽在做什麼',
          bullets: [
            '2025 年維持現場抽題、限時原型製作與多面向評審的 Makerthon 結構。',
            '官方資料也明確允許使用 AI 協作創作，但需同時附上創作聲明。',
          ],
        },
        {
          heading: '我的成績',
          bullets: ['2025 北區冠軍。'],
        },
        {
          heading: '官方頁面',
          links: [{ label: '2025 技職盃黑客松活動資料', url: 'https://www.lit.edu.tw/wp-content/uploads/2025/03/2025%E5%B9%B4%E6%8A%80%E8%81%B7%E7%9B%83%E9%BB%91%E5%AE%A2%E6%9D%BE%E7%AB%B6%E8%B3%BD%E6%B4%BB%E5%8B%95%E8%B3%87%E6%96%99.pdf' }],
        },
      ],
    },
  },

  'voc-2025-final': {
    en: {
      period: '2025',
      title: 'Vocational Cup Hackathon · 2025 National Final',
      org: 'Ministry of Education Vocational Cup Hackathon',
      tags: ['National Final Merit', 'National Final', 'Makerthon'],
      summary: 'Earned a Merit Award in the 2025 national final.',
      sections: [
        {
          heading: 'What the competition is',
          bullets: [
            'The national final is the culminating round of the vocational makerthon, bringing regional winners together on one stage.',
            'Teams still need to prove both prototype quality and the clarity of their value proposition within a short build-and-pitch cycle.',
          ],
        },
        {
          heading: 'My result',
          bullets: ['2025 National Final Merit Award.'],
        },
        {
          heading: 'Official page',
          links: [{ label: '2025 Vocational Cup Hackathon materials', url: 'https://www.lit.edu.tw/wp-content/uploads/2025/03/2025%E5%B9%B4%E6%8A%80%E8%81%B7%E7%9B%83%E9%BB%91%E5%AE%A2%E6%9D%BE%E7%AB%B6%E8%B3%BD%E6%B4%BB%E5%8B%95%E8%B3%87%E6%96%99.pdf' }],
        },
      ],
    },
    zh: {
      period: '2025',
      title: '技職盃黑客松 · 2025 全國決賽',
      org: '教育部技職盃黑客松競賽',
      tags: ['決賽佳作', '全國決賽', 'Makerthon'],
      summary: '在 2025 全國決賽獲得佳作。',
      sections: [
        {
          heading: '比賽在做什麼',
          bullets: [
            '全國決賽是技職 Makerthon 的最終階段，集結各分區優勝隊伍同場競技。',
            '隊伍除了完成作品，也要在短時間內說清楚作品價值、技術完成度與設計思考。',
          ],
        },
        {
          heading: '我的成績',
          bullets: ['2025 全國決賽佳作。'],
        },
        {
          heading: '官方頁面',
          links: [{ label: '2025 技職盃黑客松活動資料', url: 'https://www.lit.edu.tw/wp-content/uploads/2025/03/2025%E5%B9%B4%E6%8A%80%E8%81%B7%E7%9B%83%E9%BB%91%E5%AE%A2%E6%9D%BE%E7%AB%B6%E8%B3%BD%E6%B4%BB%E5%8B%95%E8%B3%87%E6%96%99.pdf' }],
        },
      ],
    },
  },

  'make-ntu': {
    en: {
      period: 'Selected participation',
      title: 'MakeNTU / NTU EE Makerthon',
      org: 'NTU EE student-led makerthon',
      tags: ['Maker', 'Hardware + Software', 'Rapid Prototype'],
      summary: 'A campus makerthon focused on creativity, technical execution, and balanced hardware-software integration under a tight build window.',
      sections: [
        {
          heading: 'What the competition is',
          bullets: [
            'MakeNTU is a makerthon organized around creativity, technical execution, and integrated hardware-software prototyping.',
            'Teams build and demo a working concept within a short intensive event window.',
          ],
        },
        {
          heading: 'My result',
          bullets: ['Selected participant / featured competition experience.'],
        },
        {
          heading: 'Official page',
          links: [{ label: 'MakeNTU overview', url: 'https://alumni.ee.ntu.edu.tw/?p=3280' }],
        },
      ],
    },
    zh: {
      period: '參與經歷',
      title: 'MakeNTU / 台大電機創客松',
      org: '台大電機學生主辦創客松',
      tags: ['Maker', '軟硬整合', '快速原型'],
      summary: '這是一場強調創意、技術與軟硬整合的創客松，要在短時間內完成作品並進行 Demo。',
      sections: [
        {
          heading: '比賽在做什麼',
          bullets: [
            'MakeNTU 以創意、技術與軟硬體整合並重為主軸，要求隊伍在密集時程內完成原型。',
            '比賽重視動手做、跨領域合作，以及把想法快速轉成可展示的作品。',
          ],
        },
        {
          heading: '我的經歷',
          bullets: ['作為重要參與競賽經歷列入。'],
        },
        {
          heading: '參考頁面',
          links: [{ label: 'MakeNTU 介紹', url: 'https://alumni.ee.ntu.edu.tw/?p=3280' }],
        },
      ],
    },
  },

  'tirt-2019': {
    en: {
      period: '2019',
      title: 'Humanoid Challenge, TIRT 2019',
      org: 'TIRT International Robot Festival',
      tags: ['Champion', 'Humanoid Robotics'],
      summary: 'Won the humanoid challenge category in TIRT, one of Taiwan’s largest robot competition festivals.',
      sections: [
        {
          heading: 'What the competition is',
          bullets: [
            'TIRT is a large-scale robot competition festival in Taiwan built to expand robotics education and connect local teams with an international stage.',
            'Its event structure includes multiple robot competition formats, including humanoid robot categories.',
          ],
        },
        {
          heading: 'My result',
          bullets: ['Champion in the humanoid challenge event.'],
        },
        {
          heading: 'Official page',
          links: [{ label: 'TIRT official site', url: 'https://www.tirtpointsrace.org/' }],
        },
      ],
    },
    zh: {
      period: '2019',
      title: '台灣國際機器人大賽 TIRT 人形機器人挑戰賽',
      org: 'TIRT 國際新創機器人節',
      tags: ['冠軍', '人形機器人'],
      summary: '在 TIRT 人形機器人挑戰賽拿下冠軍。TIRT 本身是台灣大型機器人競賽與教育推廣平台。',
      sections: [
        {
          heading: '比賽在做什麼',
          bullets: [
            'TIRT 是台灣大型機器人競賽節，目標是推動機器人教育並讓台灣成為國際賽事舞台。',
            '整體活動包含多種機器人競賽形式，其中也涵蓋人形機器人類別。',
          ],
        },
        {
          heading: '我的成績',
          bullets: ['人形機器人挑戰賽冠軍。'],
        },
        {
          heading: '官方頁面',
          links: [{ label: 'TIRT 官方網站', url: 'https://www.tirtpointsrace.org/' }],
        },
      ],
    },
  },

  'wro-2017': {
    en: {
      period: '2017',
      title: 'World Robot Olympiad Taiwan Finals',
      org: 'World Robot Olympiad',
      tags: ['Top 5', 'Robotics', 'Problem Solving'],
      summary: 'Reached the top five in the Taiwan finals of WRO, a global robotics competition centered on creativity, engineering, and problem solving.',
      sections: [
        {
          heading: 'What the competition is',
          bullets: [
            'WRO is a global robotics competition focused on creativity, engineering, and problem-solving skills.',
            'It is platform-agnostic, so teams can compete with different robot brands and custom parts as long as they meet category rules.',
          ],
        },
        {
          heading: 'My result',
          bullets: ['Top 5 in the Taiwan finals.'],
        },
        {
          heading: 'Official page',
          links: [{ label: 'WRO official overview', url: 'https://wro-association.org/about-wro/wro-is-for-everyone/' }],
        },
      ],
    },
    zh: {
      period: '2017',
      title: 'WRO 世界機器人大賽台灣決賽',
      org: 'World Robot Olympiad',
      tags: ['前五名', '機器人', '解題能力'],
      summary: '在 WRO 台灣決賽拿下前五名。WRO 是一個強調創意、工程與解題能力的全球機器人競賽。',
      sections: [
        {
          heading: '比賽在做什麼',
          bullets: [
            'WRO 是全球性的機器人競賽，核心在培養創造力、工程能力與問題解決能力。',
            '它採開放平台精神，只要符合組別規範，就能使用不同品牌的機器人與自製零件參賽。',
          ],
        },
        {
          heading: '我的成績',
          bullets: ['台灣決賽前五名。'],
        },
        {
          heading: '官方頁面',
          links: [{ label: 'WRO 官方介紹', url: 'https://wro-association.org/about-wro/wro-is-for-everyone/' }],
        },
      ],
    },
  },

  'roboone-2020': {
    en: {
      period: '2020',
      title: 'ROBO-ONE Japan 2020',
      org: 'ROBO-ONE / Biped Robot Association',
      tags: ['Top 32', 'Humanoid Battle', 'Japan'],
      summary: 'Placed in the top 32 at ROBO-ONE in Japan, a long-running official tournament series for biped humanoid robots.',
      sections: [
        {
          heading: 'What the competition is',
          bullets: [
            'ROBO-ONE is an official tournament series for biped humanoid robots.',
            'Its certified-tournament system gives strong performers qualification rights into ROBO-ONE finals.',
          ],
        },
        {
          heading: 'My result',
          bullets: ['Top 32 in Japan.'],
        },
        {
          heading: 'Official page',
          links: [{ label: 'ROBO-ONE official tournaments', url: 'https://www.robo-one.com/en/competitions/' }],
        },
      ],
    },
    zh: {
      period: '2020',
      title: '日本 ROBO-ONE 2020',
      org: 'ROBO-ONE / 二足步行機器人協會',
      tags: ['三十二強', '人形機器人', '日本'],
      summary: '在日本 ROBO-ONE 取得三十二強。ROBO-ONE 是針對雙足人形機器人的官方賽事系列。',
      sections: [
        {
          heading: '比賽在做什麼',
          bullets: [
            'ROBO-ONE 是雙足人形機器人的官方競賽系列。',
            '它透過認證賽制度讓各地優秀隊伍取得晉級 ROBO-ONE 決賽的資格。',
          ],
        },
        {
          heading: '我的成績',
          bullets: ['日本 ROBO-ONE 三十二強。'],
        },
        {
          heading: '官方頁面',
          links: [{ label: 'ROBO-ONE 官方賽事頁', url: 'https://www.robo-one.com/en/competitions/' }],
        },
      ],
    },
  },
};

const DETAILS = { ...PROJECTS, ...AWARDS };

/* ---------------- Language Switch ---------------- */
function updateCopyTooltips(lang) {
  document.querySelectorAll('.copy-trigger').forEach((el) => {
    const tooltip = lang === 'en' ? el.dataset.tooltipEn : el.dataset.tooltipZh;
    el.dataset.tooltip = tooltip || '';
  });
}

async function copyTextToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.setAttribute('readonly', '');
  ta.style.position = 'fixed';
  ta.style.left = '-9999px';
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);
}

function attachCopyHandlers() {
  document.querySelectorAll('.copy-trigger').forEach((el) => {
    if (el.dataset.copyBound === '1') return;
    el.dataset.copyBound = '1';
    el.addEventListener('click', async (e) => {
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      const textToCopy = el.dataset.copy || el.textContent || '';
      try {
        await copyTextToClipboard(textToCopy);
        const copiedMsg = currentLang === 'en' ? el.dataset.copiedEn : el.dataset.copiedZh;
        const normalMsg = currentLang === 'en' ? el.dataset.tooltipEn : el.dataset.tooltipZh;
        el.dataset.tooltip = copiedMsg || '';
        el.classList.add('show-tooltip');
        setTimeout(() => {
          el.dataset.tooltip = normalMsg || '';
          el.classList.remove('show-tooltip');
        }, 900);
      } catch (err) {
        console.error('Copy failed:', err);
      }
    });
  });
}

function setLanguage(lang) {
  currentLang = lang;
  bodyElement.classList.remove('lang-en', 'lang-zh-TW');
  bodyElement.classList.add(`lang-${lang}`);
  if (langSwitchLabel) {
    langSwitchLabel.textContent = lang === 'en' ? '中文' : 'English';
  }
  htmlElement.setAttribute('lang', lang === 'en' ? 'en' : 'zh-TW');
  try {
    const newTitle = document.querySelector(`title.lang-${lang}`).textContent;
    document.title = newTitle;
  } catch (e) {}
  updateCopyTooltips(lang);

  const mb = document.getElementById('project-modal');
  if (mb && mb.classList.contains('open') && currentDetailId && typeof renderDetail === 'function') {
    renderDetail(currentDetailId);
  }
}

langSwitchButton.addEventListener('click', () => {
  const newLang = currentLang === 'en' ? 'zh-TW' : 'en';
  langSwitchButton.classList.add('active-switch');
  setTimeout(() => langSwitchButton.classList.remove('active-switch'), 320);

  bodyElement.classList.add('page-lang-switching');
  setTimeout(() => {
    setLanguage(newLang);
    setTimeout(() => bodyElement.classList.remove('page-lang-switching'), 30);
  }, 240);
});

/* ---------------- Easter Egg: 3-Click Snake ---------------- */
const easterEggBackdrop = document.getElementById('easter-egg');
const easterEggBoard = document.getElementById('easter-board');
const easterEggStatus = document.getElementById('easter-status');
const easterEggReset = document.getElementById('easter-reset');
const easterEggAuto = document.getElementById('easter-auto');
const easterEggScore = document.getElementById('easter-score');
const easterEggMode = document.getElementById('easter-mode');
const easterEggLive = document.getElementById('easter-live');
const easterEggControls = Array.from(document.querySelectorAll('.easter-control'));
const heroPhotoTrigger = document.getElementById('hero-photo-trigger');

const SNAKE_SIZE = 12;
const SNAKE_TARGET_LENGTH = SNAKE_SIZE * SNAKE_SIZE;
const SNAKE_FILL_THRESHOLD = Math.floor(SNAKE_TARGET_LENGTH * 0.7);
const SNAKE_TICK_MS = 110;
const SNAKE_AUTO_SPEED_MULTIPLIER = 1.2;
const SNAKE_START = [
  { x: 4, y: 6 },
  { x: 3, y: 6 },
  { x: 2, y: 6 },
];
const SNAKE_DIRECTIONS = [
  { key: 'up', dx: 0, dy: -1 },
  { key: 'right', dx: 1, dy: 0 },
  { key: 'down', dx: 0, dy: 1 },
  { key: 'left', dx: -1, dy: 0 },
];
const SNAKE_DIRECTION_MAP = {
  ArrowUp: 'up',
  KeyW: 'up',
  ArrowRight: 'right',
  KeyD: 'right',
  ArrowDown: 'down',
  KeyS: 'down',
  ArrowLeft: 'left',
  KeyA: 'left',
};
const SNAKE_OPPOSITE = {
  up: 'down',
  right: 'left',
  down: 'up',
  left: 'right',
};
const SNAKE_HAMILTONIAN_CYCLE = buildSnakeHamiltonianCycle();
const SNAKE_HAMILTONIAN_INDEX = new Map(
  SNAKE_HAMILTONIAN_CYCLE.map((point, index) => [toCycleKey(point.x, point.y), index]),
);

let easterClickCount = 0;
let easterClickTimer = null;
let easterBoardCells = [];
let snakeBody = [];
let snakeFood = null;
let snakeDirection = 'right';
let snakeNextDirection = 'right';
let snakeAutoSolve = false;
let snakeGameOver = false;
let snakeWon = false;
let snakeLoopTimer = null;

function easterText(en, zh) {
  return currentLang === 'zh-TW' ? zh : en;
}

function toCycleKey(x, y) {
  return `${x},${y}`;
}

function getCycleIndex(point) {
  return SNAKE_HAMILTONIAN_INDEX.get(toCycleKey(point.x, point.y));
}

function getCycleDistance(fromIndex, toIndex) {
  return (toIndex - fromIndex + SNAKE_TARGET_LENGTH) % SNAKE_TARGET_LENGTH;
}

function buildSnakeHamiltonianCycle() {
  const cycle = [];

  for (let x = 0; x < SNAKE_SIZE; x += 1) {
    cycle.push({ x, y: 0 });
  }

  for (let y = 1; y < SNAKE_SIZE; y += 1) {
    if (y % 2 === 1) {
      for (let x = SNAKE_SIZE - 1; x >= 1; x -= 1) {
        cycle.push({ x, y });
      }
    } else {
      for (let x = 1; x < SNAKE_SIZE; x += 1) {
        cycle.push({ x, y });
      }
    }
  }

  for (let y = SNAKE_SIZE - 1; y >= 1; y -= 1) {
    cycle.push({ x: 0, y });
  }

  return cycle;
}

function cloneSegment(segment) {
  return { x: segment.x, y: segment.y };
}

function toSnakeKey(point) {
  return `${point.x},${point.y}`;
}

function isSamePoint(a, b) {
  return a.x === b.x && a.y === b.y;
}

function getDirectionBetween(from, to) {
  if (!from || !to) return null;
  if (to.x === from.x && to.y === from.y - 1) return 'up';
  if (to.x === from.x + 1 && to.y === from.y) return 'right';
  if (to.x === from.x && to.y === from.y + 1) return 'down';
  if (to.x === from.x - 1 && to.y === from.y) return 'left';
  return null;
}

function isInsideBoard(point) {
  return point.x >= 0 && point.x < SNAKE_SIZE && point.y >= 0 && point.y < SNAKE_SIZE;
}

function getSnakeHead(body = snakeBody) {
  return body[0];
}

function getSnakeTail(body = snakeBody) {
  return body[body.length - 1];
}

function getDirectionVector(directionKey) {
  return SNAKE_DIRECTIONS.find((direction) => direction.key === directionKey);
}

function getNextPoint(point, directionKey) {
  const direction = getDirectionVector(directionKey);
  return { x: point.x + direction.dx, y: point.y + direction.dy };
}

function buildOccupiedSet(body, { ignoreTail = false } = {}) {
  const limit = ignoreTail ? body.length - 1 : body.length;
  const occupied = new Set();
  for (let index = 0; index < limit; index += 1) occupied.add(toSnakeKey(body[index]));
  return occupied;
}

function getLegalDirections(body = snakeBody, currentDirection = snakeDirection) {
  const head = getSnakeHead(body);
  const tail = getSnakeTail(body);
  const legalDirections = [];

  SNAKE_DIRECTIONS.forEach((direction) => {
    if (body.length > 1 && SNAKE_OPPOSITE[currentDirection] === direction.key) return;

    const nextPoint = getNextPoint(head, direction.key);
    if (!isInsideBoard(nextPoint)) return;

    const hitsBody = body.some((segment, index) => index < body.length - 1 && isSamePoint(segment, nextPoint));
    if (hitsBody && !isSamePoint(nextPoint, tail)) return;

    legalDirections.push(direction.key);
  });

  return legalDirections;
}

function simulateSnakeMove(body, directionKey, food) {
  const nextHead = getNextPoint(getSnakeHead(body), directionKey);
  if (!isInsideBoard(nextHead)) return null;

  const willEat = food && isSamePoint(nextHead, food);
  const occupied = buildOccupiedSet(body, { ignoreTail: !willEat });
  if (occupied.has(toSnakeKey(nextHead))) return null;

  const nextBody = [nextHead, ...body.map(cloneSegment)];
  if (!willEat) nextBody.pop();
  return { body: nextBody, ateFood: Boolean(willEat) };
}

function findShortestPath(body, target, { allowTail = true } = {}) {
  const start = getSnakeHead(body);
  if (isSamePoint(start, target)) return [];

  const blocked = buildOccupiedSet(body, { ignoreTail: allowTail });
  const queue = [{ point: start, path: [] }];
  const visited = new Set([toSnakeKey(start)]);

  while (queue.length) {
    const current = queue.shift();

    for (const direction of SNAKE_DIRECTIONS) {
      const nextPoint = getNextPoint(current.point, direction.key);
      const nextKey = toSnakeKey(nextPoint);
      if (!isInsideBoard(nextPoint) || visited.has(nextKey)) continue;
      if (blocked.has(nextKey) && !isSamePoint(nextPoint, target)) continue;

      const nextPath = [...current.path, direction.key];
      if (isSamePoint(nextPoint, target)) return nextPath;

      visited.add(nextKey);
      queue.push({ point: nextPoint, path: nextPath });
    }
  }

  return null;
}

function simulatePath(body, food, path) {
  let simulatedBody = body.map(cloneSegment);
  for (const directionKey of path) {
    const result = simulateSnakeMove(simulatedBody, directionKey, food);
    if (!result) return null;
    simulatedBody = result.body;
  }
  return simulatedBody;
}

function countReachableCells(startPoint, blocked) {
  const queue = [startPoint];
  const visited = new Set([toSnakeKey(startPoint)]);

  while (queue.length) {
    const point = queue.shift();
    for (const direction of SNAKE_DIRECTIONS) {
      const nextPoint = getNextPoint(point, direction.key);
      const nextKey = toSnakeKey(nextPoint);
      if (!isInsideBoard(nextPoint) || visited.has(nextKey) || blocked.has(nextKey)) continue;
      visited.add(nextKey);
      queue.push(nextPoint);
    }
  }

  return visited.size;
}

function pickTailChasingDirection(body = snakeBody, currentDirection = snakeDirection) {
  const legalDirections = getLegalDirections(body, currentDirection);
  let bestDirection = null;
  let bestScore = -1;

  legalDirections.forEach((directionKey) => {
    const result = simulateSnakeMove(body, directionKey, snakeFood);
    if (!result) return;

    const tailPath = findShortestPath(result.body, getSnakeTail(result.body), { allowTail: true });
    const blocked = buildOccupiedSet(result.body, { ignoreTail: true });
    const openScore = countReachableCells(getSnakeHead(result.body), blocked);
    const pathScore = tailPath ? tailPath.length : -1;
    const totalScore = pathScore >= 0 ? pathScore * 1000 + openScore : openScore;

    if (totalScore > bestScore) {
      bestScore = totalScore;
      bestDirection = directionKey;
    }
  });

  return bestDirection || legalDirections[0] || null;
}

function getHamiltonianDirection(body = snakeBody) {
  const head = getSnakeHead(body);
  const headIndex = getCycleIndex(head);
  if (headIndex == null) return null;

  const nextPoint = SNAKE_HAMILTONIAN_CYCLE[(headIndex + 1) % SNAKE_HAMILTONIAN_CYCLE.length];
  const directionKey = getDirectionBetween(head, nextPoint);
  if (!directionKey) return null;

  const result = simulateSnakeMove(body, directionKey, snakeFood);
  return result ? directionKey : null;
}

function getHamiltonianShortcutDirection(body = snakeBody, currentDirection = snakeDirection) {
  const head = getSnakeHead(body);
  const tail = getSnakeTail(body);
  const food = snakeFood;
  const headIndex = getCycleIndex(head);
  const tailIndex = getCycleIndex(tail);
  const foodIndex = food ? getCycleIndex(food) : null;
  if (headIndex == null || tailIndex == null) return null;

  const headToTail = getCycleDistance(headIndex, tailIndex);
  const headToFood = foodIndex == null ? SNAKE_TARGET_LENGTH : getCycleDistance(headIndex, foodIndex);
  const legalDirections = getLegalDirections(body, currentDirection);
  let bestDirection = null;
  let bestScore = -Infinity;

  legalDirections.forEach((directionKey) => {
    const result = simulateSnakeMove(body, directionKey, food);
    if (!result) return;

    const nextHead = getSnakeHead(result.body);
    const nextIndex = getCycleIndex(nextHead);
    if (nextIndex == null) return;

    const advance = getCycleDistance(headIndex, nextIndex);
    if (advance <= 0) return;

    const tailMargin = getCycleDistance(nextIndex, tailIndex);
    const safetyMargin = result.ateFood ? 2 : 1;
    if (tailMargin <= safetyMargin || advance >= headToTail) return;

    const tailPath = findShortestPath(result.body, getSnakeTail(result.body), { allowTail: true });
    if (!tailPath) return;

    const blocked = buildOccupiedSet(result.body, { ignoreTail: true });
    const openScore = countReachableCells(nextHead, blocked);
    const foodDistance = foodIndex == null ? SNAKE_TARGET_LENGTH : getCycleDistance(nextIndex, foodIndex);
    const improvesFood = foodDistance < headToFood;
    const followsCycle = advance === 1;
    const score =
      tailMargin * 1000 +
      openScore * 10 +
      (followsCycle ? 150 : 0) +
      (improvesFood ? 500 : 0) -
      advance * 12 -
      foodDistance;

    if (score > bestScore) {
      bestScore = score;
      bestDirection = directionKey;
    }
  });

  return bestDirection;
}

function getAutoSolveDirection() {
  const pathToFood = snakeFood ? findShortestPath(snakeBody, snakeFood, { allowTail: true }) : null;
  const isLatePhase = snakeBody.length >= SNAKE_FILL_THRESHOLD;

  if (!isLatePhase && pathToFood && pathToFood.length) {
    const simulatedBody = simulatePath(snakeBody, snakeFood, pathToFood);
    if (simulatedBody) {
      const canSeeTailAfterEating = findShortestPath(simulatedBody, getSnakeTail(simulatedBody), { allowTail: true });
      if (canSeeTailAfterEating) return pathToFood[0];
    }
  }

  if (isLatePhase) {
    const shortcutDirection = getHamiltonianShortcutDirection();
    if (shortcutDirection) return shortcutDirection;

    const cycleDirection = getHamiltonianDirection();
    if (cycleDirection) return cycleDirection;
  }

  if (pathToFood && pathToFood.length) {
    const simulatedBody = simulatePath(snakeBody, snakeFood, pathToFood);
    if (simulatedBody) {
      const canSeeTailAfterEating = findShortestPath(simulatedBody, getSnakeTail(simulatedBody), { allowTail: true });
      if (canSeeTailAfterEating) return pathToFood[0];
    }
  }

  return pickTailChasingDirection();
}

function placeSnakeFood() {
  const occupied = buildOccupiedSet(snakeBody);
  const emptyCells = [];

  for (let y = 0; y < SNAKE_SIZE; y += 1) {
    for (let x = 0; x < SNAKE_SIZE; x += 1) {
      const point = { x, y };
      if (!occupied.has(toSnakeKey(point))) emptyCells.push(point);
    }
  }

  snakeFood = emptyCells.length
    ? cloneSegment(emptyCells[Math.floor(Math.random() * emptyCells.length)])
    : null;
}

function updateEasterHud() {
  const score = Math.max(0, snakeBody.length - SNAKE_START.length);

  if (snakeWon) {
    easterEggStatus.textContent = easterText('Board cleared. Perfect run.', '\u5168\u5716\u5403\u6eff\u4e86\u3002');
  } else if (snakeGameOver) {
    easterEggStatus.textContent = easterText(`Game over. Score: ${score}`, `\u904a\u6232\u7d50\u675f\uff0c\u5206\u6578\uff1a${score}`);
  } else {
    easterEggStatus.textContent = easterText(`Score: ${score}`, `\u5206\u6578\uff1a${score}`);
  }

  if (easterEggScore) {
    easterEggScore.textContent = easterText(
      `Length ${snakeBody.length} / ${SNAKE_TARGET_LENGTH}`,
      `\u9577\u5ea6 ${snakeBody.length} / ${SNAKE_TARGET_LENGTH}`,
    );
  }

  if (easterEggMode) {
    easterEggMode.textContent = snakeAutoSolve
      ? easterText('Auto Solve', '\u81ea\u52d5\u89e3\u984c')
      : easterText('Manual', '\u624b\u52d5');
  }

  if (easterEggAuto) {
    easterEggAuto.textContent = snakeAutoSolve
      ? easterText('Auto Solve: On', 'Auto Solve\uff1a\u958b')
      : easterText('Auto Solve: Off', 'Auto Solve\uff1a\u95dc');
    easterEggAuto.classList.toggle('active', snakeAutoSolve);
  }

  if (easterEggLive) easterEggLive.textContent = easterEggStatus.textContent;
}

function renderSnakeBoard() {
  if (!easterEggBoard || !easterBoardCells.length) return;

  easterBoardCells.forEach((cell) => {
    cell.classList.remove(
      'cell-snake',
      'cell-head',
      'cell-food',
      'trail-up',
      'trail-right',
      'trail-down',
      'trail-left',
    );
  });

  if (snakeFood) {
    const foodIndex = snakeFood.y * SNAKE_SIZE + snakeFood.x;
    easterBoardCells[foodIndex]?.classList.add('cell-food');
  }

  snakeBody.forEach((segment, index) => {
    const cellIndex = segment.y * SNAKE_SIZE + segment.x;
    const cell = easterBoardCells[cellIndex];
    if (!cell) return;

    cell.classList.add('cell-snake');
    const previousSegment = snakeBody[index - 1];

    if (index === 0) {
      cell.classList.add('cell-head');
      return;
    }

    const trailDirection = previousSegment ? getDirectionBetween(segment, previousSegment) : null;
    if (trailDirection) cell.classList.add(`trail-${trailDirection}`);
  });

  updateEasterHud();
}

function buildSnakeBoard() {
  if (!easterEggBoard || easterBoardCells.length) return;

  easterEggBoard.innerHTML = '';
  easterBoardCells = Array.from({ length: SNAKE_TARGET_LENGTH }, (_, index) => {
    const cell = document.createElement('div');
    cell.className = 'easter-cell';
    cell.setAttribute('role', 'gridcell');
    cell.setAttribute('aria-label', `cell-${index + 1}`);
    cell.innerHTML = `
      <span class="snake-trail" aria-hidden="true"></span>
      <span class="snake-core" aria-hidden="true"></span>
      <span class="snake-food-dot" aria-hidden="true"></span>
    `;
    easterEggBoard.appendChild(cell);
    return cell;
  });
}

function stopSnakeLoop() {
  if (snakeLoopTimer) {
    clearInterval(snakeLoopTimer);
    snakeLoopTimer = null;
  }
}

function startSnakeLoop() {
  stopSnakeLoop();
  const tickMs = snakeAutoSolve
    ? Math.max(16, Math.round(SNAKE_TICK_MS / SNAKE_AUTO_SPEED_MULTIPLIER))
    : SNAKE_TICK_MS;
  snakeLoopTimer = setInterval(stepSnakeGame, tickMs);
}

function finishSnakeGame({ won = false } = {}) {
  snakeGameOver = !won;
  snakeWon = won;
  stopSnakeLoop();
  renderSnakeBoard();
}

function stepSnakeGame() {
  if (snakeGameOver || snakeWon) return;

  if (snakeAutoSolve) {
    const autoDirection = getAutoSolveDirection();
    if (autoDirection) snakeNextDirection = autoDirection;
  }

  if (snakeBody.length > 1 && SNAKE_OPPOSITE[snakeDirection] === snakeNextDirection) {
    snakeNextDirection = snakeDirection;
  }

  const result = simulateSnakeMove(snakeBody, snakeNextDirection, snakeFood);
  if (!result) {
    finishSnakeGame();
    return;
  }

  snakeDirection = snakeNextDirection;
  snakeBody = result.body;

  if (result.ateFood) {
    if (snakeBody.length >= SNAKE_TARGET_LENGTH) {
      finishSnakeGame({ won: true });
      return;
    }
    placeSnakeFood();
  }

  renderSnakeBoard();
}

function resetEasterGame() {
  buildSnakeBoard();
  stopSnakeLoop();
  snakeBody = SNAKE_START.map(cloneSegment);
  snakeDirection = 'right';
  snakeNextDirection = 'right';
  snakeGameOver = false;
  snakeWon = false;
  placeSnakeFood();
  renderSnakeBoard();
  startSnakeLoop();
}

function openEasterEgg() {
  if (!easterEggBackdrop) return;
  resetEasterGame();
  easterEggBackdrop.classList.add('open');
  easterEggBackdrop.setAttribute('aria-hidden', 'false');
  bodyElement.classList.add('modal-open');
}

function closeEasterEgg() {
  if (!easterEggBackdrop) return;
  stopSnakeLoop();
  easterEggBackdrop.classList.remove('open');
  easterEggBackdrop.setAttribute('aria-hidden', 'true');
  if (!modalBackdrop || !modalBackdrop.classList.contains('open')) {
    bodyElement.classList.remove('modal-open');
  }
}

function clearEasterClickTimer() {
  if (easterClickTimer) {
    clearTimeout(easterClickTimer);
    easterClickTimer = null;
  }
}

function registerEasterClick() {
  easterClickCount += 1;
  clearEasterClickTimer();

  if (easterClickCount >= 3) {
    easterClickCount = 0;
    openEasterEgg();
    return;
  }

  easterClickTimer = setTimeout(() => {
    easterClickCount = 0;
    easterClickTimer = null;
  }, 1600);
}

function setSnakeDirection(directionKey) {
  if (!directionKey) return;
  snakeAutoSolve = false;
  if (snakeBody.length > 1 && SNAKE_OPPOSITE[snakeDirection] === directionKey) return;
  snakeNextDirection = directionKey;
  updateEasterHud();
  startSnakeLoop();
}

if (heroPhotoTrigger && easterEggBackdrop && easterEggBoard && easterEggStatus && easterEggReset && easterEggAuto) {
  buildSnakeBoard();
  renderSnakeBoard();

  heroPhotoTrigger.addEventListener('click', registerEasterClick);
  heroPhotoTrigger.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      registerEasterClick();
    }
  });

  easterEggReset.addEventListener('click', resetEasterGame);
  easterEggAuto.addEventListener('click', () => {
    snakeAutoSolve = !snakeAutoSolve;
    updateEasterHud();
    startSnakeLoop();
  });
  easterEggControls.forEach((button) => {
    button.addEventListener('click', () => {
      if (!easterEggBackdrop.classList.contains('open')) return;
      setSnakeDirection(button.dataset.direction);
    });
  });

  easterEggBackdrop.addEventListener('click', (event) => {
    if (event.target === easterEggBackdrop) closeEasterEgg();
  });
  document.addEventListener('keydown', (event) => {
    if (!easterEggBackdrop.classList.contains('open')) return;

    if (event.key === 'Escape') {
      closeEasterEgg();
      return;
    }

    const directionKey = SNAKE_DIRECTION_MAP[event.code] || SNAKE_DIRECTION_MAP[event.key];
    if (!directionKey) return;

    event.preventDefault();
    setSnakeDirection(directionKey);
  });
}

/* ---------------- Sticky Nav State ---------------- */
const topbar = document.getElementById('topbar');
function onScroll() {
  if (window.scrollY > 8) topbar.classList.add('scrolled');
  else topbar.classList.remove('scrolled');
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------------- Mobile Nav Toggle ---------------- */
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  navLinks.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---------------- Reveal-on-scroll ---------------- */
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && revealEls.length) {
  htmlElement.classList.add('js-reveal');

  // Mark anything already in viewport visible immediately to avoid blank flashes.
  const viewportH = window.innerHeight || document.documentElement.clientHeight;
  revealEls.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < viewportH * 0.95) el.classList.add('visible');
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.05, rootMargin: '0px 0px -10% 0px' }
  );
  revealEls.forEach((el) => {
    if (!el.classList.contains('visible')) io.observe(el);
  });

  // Failsafe: never let content stay hidden longer than 1.2s.
  setTimeout(() => {
    document.querySelectorAll('.reveal:not(.visible)').forEach((el) => el.classList.add('visible'));
  }, 1200);
}

/* ---------------- Active Section Highlight ---------------- */
const sectionIds = ['about', 'experience', 'projects', 'awards', 'skills', 'coursework'];
const navAnchors = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
const sectionMap = sectionIds
  .map((id) => ({ id, el: document.getElementById(id) }))
  .filter((x) => x.el);

if ('IntersectionObserver' in window && sectionMap.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navAnchors.forEach((a) => {
            a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
  );
  sectionMap.forEach((s) => sectionObserver.observe(s.el));
}

/* ---------------- Project Modal ---------------- */
const modalBackdrop = document.getElementById('project-modal');
const modalClose = document.getElementById('modal-close');
const modalPeriod = document.getElementById('modal-period');
const modalTitle = document.getElementById('modal-title');
const modalOrg = document.getElementById('modal-org');
const modalTags = document.getElementById('modal-tags');
const modalSummary = document.getElementById('modal-summary');
const modalSections = document.getElementById('modal-sections');
let currentDetailId = null;
let lastFocusedTrigger = null;

function renderDetail(id) {
  const detail = DETAILS[id];
  if (!detail) return;
  const data = detail[currentLang === 'zh-TW' ? 'zh' : 'en'] || detail.en;

  modalPeriod.textContent = data.period || '';
  modalTitle.textContent = data.title || '';
  modalOrg.textContent = data.org || '';

  modalTags.innerHTML = '';
  (data.tags || []).forEach((t) => {
    const el = document.createElement('span');
    el.className = 'tag';
    el.textContent = t;
    modalTags.appendChild(el);
  });

  modalSummary.textContent = data.summary || '';

  modalSections.innerHTML = '';
  (data.sections || []).forEach((sec) => {
    const h = document.createElement('h4');
    h.textContent = sec.heading;
    modalSections.appendChild(h);

    if (sec.bullets) {
      const ul = document.createElement('ul');
      sec.bullets.forEach((b) => {
        const li = document.createElement('li');
        li.textContent = b;
        ul.appendChild(li);
      });
      modalSections.appendChild(ul);
    }
    if (sec.stack) {
      const wrap = document.createElement('div');
      wrap.className = 'stack-row';
      sec.stack.forEach((s) => {
        const c = document.createElement('span');
        c.className = 'tag';
        c.textContent = s;
        wrap.appendChild(c);
      });
      modalSections.appendChild(wrap);
    }
    if (sec.links) {
      const wrap = document.createElement('div');
      wrap.className = 'modal-link-row';
      sec.links.forEach((link) => {
        const a = document.createElement('a');
        a.className = 'modal-link';
        a.href = link.url;
        a.target = '_blank';
        a.rel = 'noopener';
        a.textContent = link.label;
        wrap.appendChild(a);
      });
      modalSections.appendChild(wrap);
    }
  });
}

function openDetail(id, trigger) {
  if (!DETAILS[id]) return;
  currentDetailId = id;
  lastFocusedTrigger = trigger || null;
  renderDetail(id);
  modalBackdrop.classList.add('open');
  modalBackdrop.setAttribute('aria-hidden', 'false');
  bodyElement.classList.add('modal-open');
  setTimeout(() => modalClose.focus(), 50);
}

function closeDetail() {
  modalBackdrop.classList.remove('open');
  modalBackdrop.setAttribute('aria-hidden', 'true');
  bodyElement.classList.remove('modal-open');
  currentDetailId = null;
  if (lastFocusedTrigger && typeof lastFocusedTrigger.focus === 'function') {
    lastFocusedTrigger.focus();
  }
}

document.querySelectorAll('[data-project]').forEach((card) => {
  card.addEventListener('click', () => openDetail(card.dataset.project, card));
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openDetail(card.dataset.project, card);
    }
  });
});

document.querySelectorAll('[data-award]').forEach((card) => {
  card.addEventListener('click', () => openDetail(card.dataset.award, card));
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openDetail(card.dataset.award, card);
    }
  });
});

modalClose.addEventListener('click', closeDetail);
modalBackdrop.addEventListener('click', (e) => {
  if (e.target === modalBackdrop) closeDetail();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) closeDetail();
});

/* ---------------- Initialize ---------------- */
setLanguage(currentLang);
attachCopyHandlers();
