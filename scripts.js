/* =========================================================
   Louis Wu — Portfolio Scripts
   ========================================================= */

const langSwitchButton = document.getElementById('lang-switch');
const langSwitchLabel = document.getElementById('lang-switch-label');
const bodyElement = document.body;
const htmlElement = document.documentElement;
const SUPPORTED_LANGUAGES = new Set(['en', 'zh-TW']);
let currentLang = 'en';

/* ---------------- Project Detail Registry ---------------- */
const PROJECTS = {
  'perfrunbench': {
    en: {
      period: '2026',
      title: 'PerfRunbench',
      org: 'Electrical Engineering · Taiwan Tech',
      tags: ['Python', 'Benchmarking', 'Linux / WSL', 'ArmTune'],
      summary:
        'A cross-platform framework for running AI workloads under CPU, memory, and GPU limits; comparing reversible system and runtime settings; and producing traceable HTML/JSON reports.',
      sections: [
        {
          heading: 'Highlights',
          bullets: [
            'Runs training and inference workloads with resource guards through local, systemd, and Docker executors.',
            'Compares reversible runtime and host settings on matched workloads, recording output rate, response delay, and search cost.',
            'Supports Windows/WSL, Linux with NVIDIA GPUs, and Arm systems; ArmTune handles measured Arm inference tuning.',
          ],
        },
        {
          heading: 'Project Links',
          links: [
            { label: 'GitHub', url: 'https://github.com/xuwwwww/PerfRunbench' },
            { label: 'Reports & Documentation', url: 'ai-systems.html' },
          ],
        },
      ],
    },
    zh: {
      period: '2026',
      title: 'PerfRunbench',
      org: '電機工程系 · 台科大',
      tags: ['Python', '效能評測', 'Linux / WSL', 'ArmTune'],
      summary:
        '跨平台 AI benchmark 與調校框架，可在 CPU、記憶體與 GPU 限制下執行工作負載，比較可回復的系統與 runtime 設定，並輸出可追溯的 HTML/JSON 報告。',
      sections: [
        {
          heading: '專案重點',
          bullets: [
            '透過 local、systemd 與 Docker executor，在資源限制下執行訓練與推論工作負載。',
            '以相同工作負載比較可回復的 runtime 與主機設定，記錄輸出速率、回應延遲與搜尋成本。',
            '支援 Windows/WSL、Linux + NVIDIA GPU 與 Arm 系統；ArmTune 處理 Arm 推論的實測與調校。',
          ],
        },
        {
          heading: '專案連結',
          links: [
            { label: 'GitHub', url: 'https://github.com/xuwwwww/PerfRunbench' },
            { label: '報告與文件', url: 'ai-systems.html' },
          ],
        },
      ],
    },
  },

  'moe-dugan': {
    en: {
      period: '2024',
      title: 'MoE-DUGAN: Generative Denoising for Low-Dose CT',
      org: 'Lab of AI & Computer Vision · NTUST',
      tags: ['PyTorch', 'GAN', 'DDPM', 'Mixture of Experts', 'Medical Imaging'],
      summary:
        'An undergraduate research project extending the dual-discriminator DUGAN architecture with expert routing and adaptive adversarial-loss weighting for low-dose CT denoising.',
      sections: [
        {
          heading: 'Highlights',
          bullets: [
            'Extended the dual-discriminator DUGAN architecture into MoE-DUGAN for low-dose CT image denoising.',
            'Designed expert routing around image noise characteristics and implemented a Noise Expert module that adapts adversarial-loss weights.',
            'Analyzed image features and loss behavior under different noise conditions to guide the mixture-of-experts training design.',
          ],
        },
        {
          heading: 'Tech Stack',
          stack: ['PyTorch', 'Residual Denoising', 'DDPM (Diffusion Models)', 'Probability Simulation', 'Machine Learning'],
        },
      ],
    },
    zh: {
      period: '2024',
      title: 'MoE-DUGAN：低劑量 CT 生成式去雜訊',
      org: 'AI 與電腦視覺實驗室 · NTUST',
      tags: ['PyTorch', 'GAN', 'DDPM', 'Mixture of Experts', '醫學影像'],
      summary:
        '大學部研究專題：延伸 dual-discriminator DUGAN 架構，加入 expert routing 與可調式對抗 loss 權重，用於低劑量 CT 去雜訊。',
      sections: [
        {
          heading: '研究亮點',
          bullets: [
            '將 dual-discriminator DUGAN 架構延伸為 MoE-DUGAN，用於低劑量 CT 影像去雜訊。',
            '依影像雜訊特性設計 expert routing，並實作可調整對抗 loss 權重的 Noise Expert。',
            '分析不同雜訊條件下的影像特徵與 loss 行為，據此調整 mixture-of-experts 訓練設計。',
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
      period: '2023',
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
      period: '2023',
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
      period: '2023',
      title: 'Surface EMG-Based Hand-State Classification',
      org: 'Undergraduate Research Proof of Concept · Taiwan Tech',
      tags: ['Surface EMG', 'LSTM', 'Time Series', 'Bio-signal'],
      summary:
        'A complete surface-electromyography acquisition and classification proof of concept that distinguishes fist clenching from release.',
      sections: [
        {
          heading: 'Highlights',
          bullets: [
            'Set up laboratory sensors and instrumentation to capture muscle-activation signals.',
            'Prepared and processed the acquired time-series data for model training.',
            'Trained classifiers, including an LSTM-based model, to distinguish hand states such as fist clenching and release.',
            'Documented the setup, methods, and results in a complete research report.',
          ],
        },
      ],
    },
    zh: {
      period: '2023',
      title: '表面肌電手部狀態分類',
      org: '大學部研究概念驗證 · 台科大',
      tags: ['表面肌電', 'LSTM', '時序資料', '生醫訊號'],
      summary:
        '完成表面肌電訊號採集與分類的概念驗證，可辨識握拳與放開狀態。',
      sections: [
        {
          heading: '研究亮點',
          bullets: [
            '使用實驗室感測器與儀器採集肌肉活動訊號。',
            '整理並處理採集到的時序資料供模型訓練。',
            '訓練包含 LSTM 的分類模型，辨識握拳與放開等手部狀態。',
            '將實驗配置、方法與結果整理成完整研究報告。',
          ],
        },
      ],
    },
  },

  'atmega-os': {
    en: {
      period: 'Sep. 2026 – Present',
      title: 'ATmega OS: AVR Kernel and RV32I Guest Runtime',
      org: 'Independent Project',
      tags: ['AVR C', 'Assembly', 'Preemptive Scheduling', 'UART', 'RV32I'],
      summary:
        'A small operating-system kernel built from scratch for an ATmega328P-class board, with preemptive scheduling, kernel synchronization primitives, diagnostics, and dynamically uploaded RISC-V guests.',
      sections: [
        {
          heading: 'Kernel',
          bullets: [
            'Implemented a stackful preemptive scheduler with per-task SRAM stacks, four fixed-priority levels, and round-robin scheduling within each level.',
            'Wrote the AVR assembly context switch to save and restore all registers, SREG, and the stack pointer.',
            'Added sleep, task restart and exit handling, stack guards, panic records, software reboot, and one-shot and periodic software timers.',
          ],
        },
        {
          heading: 'Synchronization and I/O',
          bullets: [
            'Built interrupt-driven UART RX/TX ring buffers, semaphores, a priority-inheritance mutex, message queues, and event flags.',
            'Implemented an interactive UART shell for uptime, task state, stack-watermark inspection, LED control, and task restart.',
            'Compressed fixed log messages at build time and decoded their UART frames on the host.',
          ],
        },
        {
          heading: 'RISC-V Guest Runtime',
          bullets: [
            'Ran dynamically uploaded RV32I guests inside a 2 KB SRAM budget without reflashing the AVR firmware.',
            'Supported up to three resident guests and interleaved execution with a configurable instruction quantum.',
            'Validated the system on a 16 MHz ATmega328P-class board at a 2 kHz scheduler tick with automated and hardware-regression tests.',
          ],
        },
      ],
    },
    zh: {
      period: '2026 年 9 月 – 至今',
      title: 'ATmega OS：AVR 即時核心與 RV32I Guest Runtime',
      org: '個人專案',
      tags: ['AVR C', 'Assembly', '搶先式排程', 'UART', 'RV32I'],
      summary:
        '從零開始為 ATmega328P 相容板實作的小型作業系統核心，包含搶先式排程、核心同步原語、診斷機制與可動態載入的 RISC-V guest。',
      sections: [
        {
          heading: '核心',
          bullets: [
            '實作 stackful preemptive scheduler，每個 task 使用獨立 SRAM stack，具四級固定優先權與同級 round-robin。',
            '以 AVR assembly 撰寫 context switch，保存並恢復全部 registers、SREG 與 stack pointer。',
            '加入 sleep、task restart 與 exit、stack guard、panic record、software reboot，以及 one-shot／periodic software timer。',
          ],
        },
        {
          heading: '同步與輸入輸出',
          bullets: [
            '建立 UART RX/TX interrupt ring buffer、semaphore、priority-inheritance mutex、message queue 與 event flags。',
            '實作互動式 UART shell，可查詢 uptime、task 狀態與 stack 水位，並控制 LED、重啟 task。',
            '在 build 階段壓縮固定 log message，並由電腦端解碼 UART frame。',
          ],
        },
        {
          heading: 'RISC-V Guest Runtime',
          bullets: [
            '在 2 KB SRAM 限制內執行動態上傳的 RV32I guest，不需重新燒錄 AVR firmware。',
            '支援最多三個 resident guest，並以可調 instruction quantum 交錯執行。',
            '在 16 MHz ATmega328P 相容板與 2 kHz scheduler tick 上，通過自動化與硬體 regression 測試。',
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
const DETAIL_RESOURCE_LINKS = {
  'perfrunbench': [
    { label: 'PerfRunbench Poster', url: 'assets/research/perfrunbench-poster.pdf' },
  ],
  'moe-dugan': [
    { label: 'CS Poster', url: 'assets/research/CS_poster.pdf' },
  ],
  'clinical-nlp': [
    { label: 'EE Poster', url: 'assets/research/EE_poster.pdf' },
  ],
};

/* ---------------- Language Switch ---------------- */
function updateCopyTooltips(lang) {
  document.querySelectorAll('.copy-trigger').forEach((el) => {
    const tooltip = lang === 'en' ? el.dataset.tooltipEn : el.dataset.tooltipZh;
    el.dataset.tooltip = tooltip || '';
  });
}

function normalizeLanguage(lang) {
  return SUPPORTED_LANGUAGES.has(lang) ? lang : 'en';
}

function trackEvent(name, params = {}) {
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', name, params);
}

function normalizeAnalyticsId(value, fallback = 'unknown') {
  const normalized = String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  return normalized || fallback;
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
        trackEvent('copy_click', {
          copy_target: textToCopy.slice(0, 80),
        });
      } catch (err) {
        console.error('Copy failed:', err);
      }
    });
  });
}

function setLanguage(lang) {
  lang = normalizeLanguage(lang);
  currentLang = lang;
  bodyElement.classList.remove('lang-en', 'lang-zh-TW');
  bodyElement.classList.add(`lang-${lang}`);
  if (langSwitchLabel) {
    langSwitchLabel.textContent = lang === 'en' ? '\u4e2d\u6587' : 'English';
    langSwitchLabel.setAttribute('lang', lang === 'en' ? 'zh-TW' : 'en');
  }
  langSwitchButton.setAttribute('aria-label', lang === 'en' ? 'Switch to Chinese' : 'Switch to English');
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
  trackEvent('language_switch', {
    from_language: currentLang,
    to_language: newLang,
  });
  langSwitchButton.classList.add('active-switch');
  setTimeout(() => langSwitchButton.classList.remove('active-switch'), 320);

  bodyElement.classList.add('page-lang-switching');
  setTimeout(() => {
    setLanguage(newLang);
    setTimeout(() => bodyElement.classList.remove('page-lang-switching'), 30);
  }, 240);
});

/* ---------------- Easter Egg: Snake ---------------- */
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
const SNAKE_CYCLE_TEMPLATES = buildSnakeCycleTemplates();
const SNAKE_NEIGHBORS = Array.from({ length: SNAKE_TARGET_LENGTH }, (_, id) => {
  const point = snakeCellPoint(id);
  return SNAKE_DIRECTIONS.map((direction) => ({ x: point.x + direction.dx, y: point.y + direction.dy }))
    .filter(isInsideBoard).map(snakeCellId);
});
const SNAKE_EDGE_DEPTHS = Uint8Array.from({ length: SNAKE_TARGET_LENGTH }, (_, id) => {
  const { x, y } = snakeCellPoint(id);
  return Math.min(x, y, SNAKE_SIZE - 1 - x, SNAKE_SIZE - 1 - y);
});

let easterBoardCells = [];
let snakeBody = [];
let snakeFood = null;
let snakeDirection = 'right';
let snakeNextDirection = 'right';
let snakeAutoSolve = true;
let snakeGameOver = false;
let snakeWon = false;
let snakeLoopTimer = null;
let snakeHamiltonianCycle = SNAKE_HAMILTONIAN_CYCLE;
let snakeHamiltonianIndex = indexSnakeCycle(snakeHamiltonianCycle);
let snakeAutoPlan = null;
const snakeFoodPathCache = new Map();

function easterText(en, zh) {
  return currentLang === 'zh-TW' ? zh : en;
}

function snakeCellId(point) {
  return point.y * SNAKE_SIZE + point.x;
}

function snakeCellPoint(id) {
  return { x: id % SNAKE_SIZE, y: Math.floor(id / SNAKE_SIZE) };
}

function indexSnakeCycle(cycle) {
  const indices = new Int16Array(SNAKE_TARGET_LENGTH);
  cycle.forEach((point, index) => { indices[snakeCellId(point)] = index; });
  return indices;
}

function getCycleIndex(point) {
  return snakeHamiltonianIndex[snakeCellId(point)];
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

function buildSnakeCycleTemplates() {
  const templates = [];
  for (let rotation = 0; rotation < 4; rotation += 1) {
    let cycle = SNAKE_HAMILTONIAN_CYCLE.map((point) => {
      let { x, y } = point;
      for (let turn = 0; turn < rotation; turn += 1) [x, y] = [SNAKE_SIZE - 1 - y, x];
      return { x, y };
    });
    templates.push({ cycle, indices: indexSnakeCycle(cycle) });
    cycle = [...cycle].reverse();
    templates.push({ cycle, indices: indexSnakeCycle(cycle) });
  }
  return templates;
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

function hasSnakeCycleOrder(body, indices = snakeHamiltonianIndex) {
  // Tail -> body -> head must fit within one lap, including every shortcut.
  // A reachable tail alone does not preserve this invariant.
  let span = 0;
  for (let index = body.length - 1; index > 0; index -= 1) {
    const distance = getCycleDistance(indices[snakeCellId(body[index])], indices[snakeCellId(body[index - 1])]);
    if (!distance) return false;
    span += distance;
    if (span >= SNAKE_TARGET_LENGTH) return false;
  }
  return true;
}

function findShortestSnakePath(body, target, order = 0, metrics = null, canStep = null) {
  const start = snakeCellId(getSnakeHead(body));
  const end = snakeCellId(target);
  const blocked = new Uint8Array(SNAKE_TARGET_LENGTH);
  body.slice(1, -1).forEach((point) => { blocked[snakeCellId(point)] = 1; });
  const parents = new Int16Array(SNAKE_TARGET_LENGTH).fill(-1);
  const costs = new Int16Array(SNAKE_TARGET_LENGTH).fill(32767);
  const edgeCosts = new Int16Array(SNAKE_TARGET_LENGTH).fill(32767);
  const heuristic = (id) => Math.abs(id % SNAKE_SIZE - target.x) + Math.abs(Math.floor(id / SNAKE_SIZE) - target.y);
  // Distance stays primary. Within an f bucket, accumulated edge depth is
  // an admissible secondary cost: the first goal is the outermost shortest path.
  const open = new Array(SNAKE_TARGET_LENGTH * 2);
  let estimate = heuristic(start);
  let queued = 1;
  costs[start] = 0;
  edgeCosts[start] = 0;
  parents[start] = start;
  open[estimate] = [{ id: start, cost: 0, edgeCost: 0 }];
  while (queued) {
    while (!open[estimate]?.length) estimate += 1;
    const bucket = open[estimate];
    let best = bucket.length - 1;
    for (let i = best - 1; i >= 0; i -= 1) {
      if (bucket[i].edgeCost < bucket[best].edgeCost) best = i;
    }
    const { id, cost, edgeCost } = bucket[best];
    bucket[best] = bucket[bucket.length - 1];
    bucket.pop();
    queued -= 1;
    if (cost !== costs[id] || edgeCost !== edgeCosts[id]) continue;
    if (metrics) metrics.expanded = (metrics.expanded || 0) + 1;
    if (id === end) {
      const points = [];
      for (let cell = end; cell !== start; cell = parents[cell]) points.push(snakeCellPoint(cell));
      points.reverse();
      return points.map((point, index) => getDirectionBetween(index ? points[index - 1] : body[0], point));
    }
    const neighbors = SNAKE_NEIGHBORS[id];
    for (let offset = neighbors.length - 1; offset >= 0; offset -= 1) {
      const next = neighbors[(offset + order) % neighbors.length];
      if (blocked[next] && next !== end) continue;
      if (canStep && !canStep(id, next)) continue;
      const nextCost = cost + 1;
      const nextEdgeCost = edgeCost + SNAKE_EDGE_DEPTHS[next];
      if (nextCost > costs[next] || (nextCost === costs[next] && nextEdgeCost >= edgeCosts[next])) continue;
      costs[next] = nextCost;
      edgeCosts[next] = nextEdgeCost;
      parents[next] = id;
      const nextEstimate = nextCost + heuristic(next);
      (open[nextEstimate] ||= []).push({ id: next, cost: nextCost, edgeCost: nextEdgeCost });
      queued += 1;
    }
  }
  return null;
}

function* findShortestSnakeAlternatives(body, target, length, limit = 8) {
  const start = snakeCellId(getSnakeHead(body));
  const end = snakeCellId(target);
  const blocked = new Uint8Array(SNAKE_TARGET_LENGTH);
  body.slice(1, -1).forEach((point) => { blocked[snakeCellId(point)] = 1; });
  const distances = new Int16Array(SNAKE_TARGET_LENGTH).fill(-1);
  const edgeCosts = new Int16Array(SNAKE_TARGET_LENGTH).fill(32767);
  const queue = [end];
  distances[end] = edgeCosts[end] = 0;
  // Reverse BFS builds the shortest-path DAG and its exact remaining edge cost.
  for (let cursor = 0; cursor < queue.length; cursor += 1) {
    const id = queue[cursor];
    for (const next of SNAKE_NEIGHBORS[id]) {
      if (blocked[next]) continue;
      const distance = distances[id] + 1;
      if (distances[next] !== -1 && distances[next] < distance) continue;
      if (distances[next] === -1) {
        distances[next] = distance;
        queue.push(next);
      }
      edgeCosts[next] = Math.min(edgeCosts[next], SNAKE_EDGE_DEPTHS[id] + edgeCosts[id]);
    }
  }
  if (distances[start] !== length) return;
  const open = [{ ids: [start], cost: 0, estimate: edgeCosts[start] }];
  let yielded = 0;
  // Enumerate only equal-length routes, most peripheral first. Prefer deeper
  // prefixes on a tie so a large family of equivalent routes stays inexpensive.
  while (open.length && yielded < limit) {
    let best = open.length - 1;
    for (let i = best - 1; i >= 0; i -= 1) {
      if (open[i].estimate < open[best].estimate
        || (open[i].estimate === open[best].estimate && open[i].ids.length > open[best].ids.length)) best = i;
    }
    const current = open[best];
    open[best] = open[open.length - 1];
    open.pop();
    const id = current.ids[current.ids.length - 1];
    if (id === end) {
      yielded += 1;
      yield current.ids.slice(1).map((cell, i) => getDirectionBetween(snakeCellPoint(current.ids[i]), snakeCellPoint(cell)));
      continue;
    }
    for (const next of SNAKE_NEIGHBORS[id]) {
      if (distances[next] !== distances[id] - 1) continue;
      const cost = current.cost + SNAKE_EDGE_DEPTHS[next];
      open.push({ ids: [...current.ids, next], cost, estimate: cost + edgeCosts[next] });
    }
  }
}

function getSnakePathEdgeCost(body, path) {
  let point = getSnakeHead(body);
  let cost = 0;
  for (const direction of path) {
    point = getNextPoint(point, direction);
    cost += SNAKE_EDGE_DEPTHS[snakeCellId(point)];
  }
  return cost;
}

function simulateSnakePath(body, food, path) {
  let resultBody = body;
  for (const direction of path) {
    const result = simulateSnakeMove(resultBody, direction, food);
    if (!result) return null;
    resultBody = result.body;
  }
  return resultBody;
}

function buildSnakeCompletionCycle(body) {
  const fixedBody = [...body].reverse().map(snakeCellId);
  // Keep the actual body intact; stretch a head-to-tail return path into a tour.
  // A partial tour is never a completion certificate.
  for (let attempt = 0; attempt < 12; attempt += 1) {
    const returnPath = findShortestSnakePath(body, getSnakeTail(body), attempt % 4);
    if (!returnPath) return null;
    let point = getSnakeHead(body);
    const cycle = [...fixedBody];
    returnPath.slice(0, -1).forEach((direction) => {
      point = getNextPoint(point, direction);
      cycle.push(snakeCellId(point));
    });
    const used = new Uint8Array(SNAKE_TARGET_LENGTH);
    cycle.forEach((id) => { used[id] = 1; });
    let changed = true;
    while (changed && cycle.length < SNAKE_TARGET_LENGTH) {
      changed = false;
      const edgeCount = cycle.length - fixedBody.length + 1;
      for (let scan = 0; scan < edgeCount; scan += 1) {
        const edge = fixedBody.length - 1 + (scan + attempt) % edgeCount;
        const a = cycle[edge];
        const b = cycle[(edge + 1) % cycle.length];
        const horizontal = Math.abs(a - b) === 1;
        const offsets = horizontal ? [-SNAKE_SIZE, SNAKE_SIZE] : [-1, 1];
        if (attempt % 2) offsets.reverse();
        for (const offset of offsets) {
          const c = a + offset;
          const d = b + offset;
          if (!SNAKE_NEIGHBORS[a].includes(c) || !SNAKE_NEIGHBORS[b].includes(d) || used[c] || used[d]) continue;
          used[c] = used[d] = 1;
          cycle.splice(edge + 1, 0, c, d);
          changed = true;
          break;
        }
        if (changed) break;
      }
    }
    if (cycle.length === SNAKE_TARGET_LENGTH) return cycle.map(snakeCellPoint);
  }
  return null;
}

function rewireSnakeCompletionCycle(body) {
  const bodyIds = body.map(snakeCellId);
  const spanOf = (indices) => {
    let span = 0;
    for (let i = 1; i < bodyIds.length; i += 1) {
      span += getCycleDistance(indices[bodyIds[i]], indices[bodyIds[i - 1]]);
    }
    return span;
  };
  let bestCycle = snakeHamiltonianCycle;
  let bestSpan = spanOf(snakeHamiltonianIndex);
  for (const template of SNAKE_CYCLE_TEMPLATES) {
    const span = spanOf(template.indices);
    if (span < bestSpan) {
      bestSpan = span;
      bestCycle = template.cycle;
    }
  }
  const squares = [];
  for (let y = 0; y < SNAKE_SIZE - 1; y += 1) {
    for (let x = 0; x < SNAKE_SIZE - 1; x += 1) squares.push(y * SNAKE_SIZE + x);
  }
  const head = body[0];
  const distance = (id) => Math.abs(id % SNAKE_SIZE - head.x) + Math.abs(Math.floor(id / SNAKE_SIZE) - head.y);
  squares.sort((a, b) => distance(a) - distance(b));
  let budget = 1600;
  for (let iteration = 0; iteration < 4 && budget > 0; iteration += 1) {
    const ids = bestCycle.map(snakeCellId);
    const first = new Int16Array(SNAKE_TARGET_LENGTH);
    const second = new Int16Array(SNAKE_TARGET_LENGTH);
    ids.forEach((id, index) => {
      first[id] = ids[(index + 1) % ids.length];
      second[id] = ids[(index + ids.length - 1) % ids.length];
    });
    const connected = (a, b) => first[a] === b || second[a] === b;
    const squareFlip = (a) => {
      const b = a + 1;
      const c = a + SNAKE_SIZE;
      const d = c + 1;
      if (connected(a, b) && connected(c, d) && !connected(a, c) && !connected(b, d)) return [a, b, c, d];
      if (connected(a, c) && connected(b, d) && !connected(a, b) && !connected(c, d)) return [a, c, b, d];
      return null;
    };
    const replace = (id, oldNeighbor, newNeighbor) => {
      if (first[id] === oldNeighbor) first[id] = newNeighbor;
      else second[id] = newNeighbor;
    };
    const flip = (edges, undo = false) => {
      let [a, b, c, d] = edges;
      if (undo) [b, c] = [c, b];
      replace(a, b, c);
      replace(b, a, d);
      replace(c, d, a);
      replace(d, c, b);
    };
    const oldSpan = bestSpan;
    let nextCycle = null;
    // One square flip splits a tour. Only commit after a second flip joins
    // the two components into a single 144-cell tour again.
    for (const cutSquare of squares) {
      const cut = squareFlip(cutSquare);
      if (!cut) continue;
      flip(cut);
      const component = new Uint8Array(SNAKE_TARGET_LENGTH);
      let previous = -1;
      let current = cut[0];
      do {
        component[current] = 1;
        const next = first[current] === previous ? second[current] : first[current];
        previous = current;
        current = next;
      } while (current !== cut[0]);
      for (const joinSquare of squares) {
        const join = squareFlip(joinSquare);
        if (!join || component[join[0]] === component[join[2]]) continue;
        if (budget-- <= 0) break;
        flip(join);
        const candidate = [];
        const indices = new Int16Array(SNAKE_TARGET_LENGTH);
        previous = -1;
        current = bodyIds[bodyIds.length - 1];
        do {
          indices[current] = candidate.length;
          candidate.push(current);
          const next = first[current] === previous ? second[current] : first[current];
          previous = current;
          current = next;
        } while (current !== candidate[0] && candidate.length <= SNAKE_TARGET_LENGTH);
        if (candidate.length === SNAKE_TARGET_LENGTH) {
          const forwardSpan = spanOf(indices);
          const reverseSpan = (body.length - 1) * SNAKE_TARGET_LENGTH - forwardSpan;
          const span = Math.min(forwardSpan, reverseSpan);
          if (span < bestSpan) {
            bestSpan = span;
            nextCycle = (forwardSpan < reverseSpan ? candidate : candidate.reverse()).map(snakeCellPoint);
            if (span < SNAKE_TARGET_LENGTH) return nextCycle;
          }
        }
        flip(join, true);
      }
      flip(cut, true);
      if (budget <= 0) break;
    }
    if (bestSpan >= oldSpan || !nextCycle) break;
    bestCycle = nextCycle;
  }
  return null;
}

function certifySnakeFoodPath(path) {
  const body = simulateSnakePath(snakeBody, snakeFood, path);
  if (!body) return null;
  return certifySnakeBody(body);
}

function certifySnakeBody(body) {
  const key = body.map(snakeCellId).join(',');
  if (snakeFoodPathCache.has(key)) return snakeFoodPathCache.get(key);
  let cycle = hasSnakeCycleOrder(body) ? snakeHamiltonianCycle : null;
  if (!cycle) {
    for (const template of SNAKE_CYCLE_TEMPLATES) {
      if (hasSnakeCycleOrder(body, template.indices)) {
        cycle = template.cycle;
        break;
      }
    }
  }
  cycle ||= rewireSnakeCompletionCycle(body) || buildSnakeCompletionCycle(body);
  // A shared prefix can lead to the same landing body on successive ticks.
  // Reuse its proof (or failed search) until eating changes the board and tour.
  snakeFoodPathCache.set(key, cycle);
  return cycle;
}

function findSafeSnakeFoodPath(body, food, indices = snakeHamiltonianIndex, maxLength = SNAKE_TARGET_LENGTH - 1) {
  const head = getSnakeHead(body);
  const headIndex = indices[snakeCellId(head)];
  const foodDistance = getCycleDistance(headIndex, indices[snakeCellId(food)]);
  const tailDistance = getCycleDistance(headIndex, indices[snakeCellId(getSnakeTail(body))]);
  // Keep the safety arc, but apply the same shortest-first, edge-second ranking.
  const shortest = findShortestSnakePath(body, food, 0, null, (from, to) => {
    const distance = getCycleDistance(headIndex, indices[to]);
    return distance > getCycleDistance(headIndex, indices[from])
      && distance <= foodDistance && distance < tailDistance;
  });
  if (shortest) return shortest.length <= maxLength ? shortest : null;
  if (foodDistance > maxLength) return null;
  // The food can lie in a gap behind the current tail. Following the tour lets
  // that tail vacate cells; a static blocked-cell search cannot see this route.
  const cells = new Int16Array(SNAKE_TARGET_LENGTH);
  indices.forEach((index, id) => { cells[index] = id; });
  const path = [];
  let previous = head;
  for (let step = 1; step <= foodDistance; step += 1) {
    const point = snakeCellPoint(cells[(headIndex + step) % SNAKE_TARGET_LENGTH]);
    path.push(getDirectionBetween(previous, point));
    previous = point;
  }
  return simulateSnakePath(body, food, path) ? path : null;
}

function findSafeSnakeFoodPlan(body, food, maxLength, maxEdgeCost = Infinity) {
  const tours = [{ cycle: snakeHamiltonianCycle, indices: snakeHamiltonianIndex }, ...SNAKE_CYCLE_TEMPLATES];
  if (snakeAutoPlan && !tours.some(({ cycle }) => cycle === snakeAutoPlan.cycle)) {
    tours.push({ cycle: snakeAutoPlan.cycle, indices: indexSnakeCycle(snakeAutoPlan.cycle) });
  }
  let best = null;
  for (const { cycle, indices } of tours) {
    if (!hasSnakeCycleOrder(body, indices)) continue;
    const path = findSafeSnakeFoodPath(body, food, indices, maxLength);
    if (!path?.length || path.length > maxLength) continue;
    const edgeCost = getSnakePathEdgeCost(body, path);
    if (path.length === maxLength && edgeCost >= maxEdgeCost) continue;
    best = { path, cycle };
    maxLength = path.length;
    maxEdgeCost = edgeCost;
  }
  return best;
}

function findSafeSnakeFirstStepPlan(direction, maxLength) {
  const result = simulateSnakeMove(snakeBody, direction, snakeFood);
  if (!result || result.ateFood || maxLength < 2) return null;
  let plan = findSafeSnakeFoodPlan(result.body, snakeFood, maxLength - 1);
  if (!plan) {
    const cycle = certifySnakeBody(result.body);
    if (!cycle) return null;
    const path = findSafeSnakeFoodPath(result.body, snakeFood, indexSnakeCycle(cycle), maxLength - 1);
    if (!path?.length || path.length >= maxLength) return null;
    plan = { path, cycle };
  }
  return { path: [direction, ...plan.path], cycle: plan.cycle };
}

function getSafeSnakeCycleDirection() {
  if (!hasSnakeCycleOrder(snakeBody)) return null;
  const head = getSnakeHead();
  const headIndex = getCycleIndex(head);
  const foodDistance = getCycleDistance(headIndex, getCycleIndex(snakeFood));
  const shortestDirection = findSafeSnakeFoodPath(snakeBody, snakeFood)?.[0];
  let bestDirection = null;
  let bestAdvance = 0;

  for (const direction of SNAKE_DIRECTIONS) {
    const nextPoint = getNextPoint(head, direction.key);
    if (!isInsideBoard(nextPoint)) continue;
    const advance = getCycleDistance(headIndex, getCycleIndex(nextPoint));
    if (!advance || advance > foodDistance) continue;
    const result = simulateSnakeMove(snakeBody, direction.key, snakeFood);
    if (!result || !hasSnakeCycleOrder(result.body)) continue;
    if (direction.key === shortestDirection) return direction.key;
    if (advance > bestAdvance) {
      bestAdvance = advance;
      bestDirection = direction.key;
    }
  }
  return bestDirection;
}

function getAutoSolveDirection() {
  if (!snakeFood) return null;
  const shortest = findShortestSnakePath(snakeBody, snakeFood);
  const remaining = snakeAutoPlan
    ? snakeAutoPlan.path.length
    : getCycleDistance(getCycleIndex(getSnakeHead()), getCycleIndex(snakeFood));
  const currentEdgeCost = snakeAutoPlan ? getSnakePathEdgeCost(snakeBody, snakeAutoPlan.path) : Infinity;
  // Re-evaluate at every length, including the endgame. Never replace a route
  // with a longer one, or trade progress for a merely safe single move.
  if (shortest?.length && shortest.length <= remaining
    && (shortest.length < remaining || getSnakePathEdgeCost(snakeBody, shortest) < currentEdgeCost)) {
    let cycle = certifySnakeFoodPath(shortest);
    if (cycle) {
      snakeAutoPlan = { path: shortest, cycle };
    } else {
      const tried = shortest.join(',');
      for (const path of findShortestSnakeAlternatives(snakeBody, snakeFood, shortest.length)) {
        if (path.join(',') === tried) continue;
        if (path.length === remaining && getSnakePathEdgeCost(snakeBody, path) >= currentEdgeCost) break;
        cycle = certifySnakeFoodPath(path);
        if (cycle) {
          snakeAutoPlan = { path, cycle };
          break;
        }
      }
    }
  }
  // An unrestricted shortest path may be unsafe while a different, slightly
  // longer certified shortcut still beats the pending route. Compare it too.
  const safePlan = findSafeSnakeFoodPlan(snakeBody, snakeFood,
    snakeAutoPlan?.path.length ?? remaining,
    snakeAutoPlan ? getSnakePathEdgeCost(snakeBody, snakeAutoPlan.path) : Infinity);
  if (safePlan) snakeAutoPlan = safePlan;
  // A shortest first step need not force us to finish the same static route.
  // Require a complete retreat to this apple within the OLD remaining budget;
  // unlike one-step-only rewiring, this cannot reset the budget and chase tails.
  if (shortest?.length && shortest[0] !== snakeAutoPlan?.path[0]) {
    const stepPlan = findSafeSnakeFirstStepPlan(shortest[0], snakeAutoPlan?.path.length ?? remaining);
    if (stepPlan && (!snakeAutoPlan || stepPlan.path.length < snakeAutoPlan.path.length
      || (stepPlan.path.length === snakeAutoPlan.path.length
        && getSnakePathEdgeCost(snakeBody, stepPlan.path) < getSnakePathEdgeCost(snakeBody, snakeAutoPlan.path)))) {
      snakeAutoPlan = stepPlan;
    }
  }
  if (snakeAutoPlan) return snakeAutoPlan.path[0];
  return getSafeSnakeCycleDirection();
}

function advanceSnakeAutoPlan() {
  if (!snakeAutoPlan) return;
  snakeAutoPlan.path.shift();
  if (snakeAutoPlan.path.length) return;
  snakeHamiltonianCycle = snakeAutoPlan.cycle;
  snakeHamiltonianIndex = indexSnakeCycle(snakeHamiltonianCycle);
  snakeAutoPlan = null;
}

function placeSnakeFood() {
  snakeFoodPathCache.clear();
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
    easterEggAuto.setAttribute('aria-pressed', String(snakeAutoSolve));
  }

  if (easterEggLive) easterEggLive.textContent = easterEggStatus.textContent;
}

function getSnakeSegmentColor(index, length) {
  if (index === 0) return '#8fd18f';
  const fade = (index - 1) / Math.max(1, length - 2);
  const front = [47, 125, 50];
  const tail = [101, 158, 74];
  return `rgb(${front.map((channel, axis) => Math.round(channel + (tail[axis] - channel) * fade)).join(', ')})`;
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
    cell.style.removeProperty('--snake-core-fill');
    cell.style.removeProperty('--snake-trail-fill');
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
    const color = getSnakeSegmentColor(index, snakeBody.length);
    cell.style.setProperty('--snake-core-fill', color);
    const previousSegment = snakeBody[index - 1];

    if (index === 0) {
      cell.classList.add('cell-head');
      return;
    }

    const trailDirection = previousSegment ? getDirectionBetween(segment, previousSegment) : null;
    if (trailDirection) {
      cell.classList.add(`trail-${trailDirection}`);
      const previousColor = getSnakeSegmentColor(index - 1, snakeBody.length);
      const cssDirection = { up: 'top', right: 'right', down: 'bottom', left: 'left' }[trailDirection];
      cell.style.setProperty('--snake-trail-fill', `linear-gradient(to ${cssDirection}, ${color}, ${previousColor})`);
    }
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
    if (!autoDirection) {
      finishSnakeGame();
      return;
    }
    snakeNextDirection = autoDirection;
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
  if (snakeAutoSolve) advanceSnakeAutoPlan();

  if (result.ateFood) {
    if (snakeBody.length >= SNAKE_TARGET_LENGTH) {
      snakeFood = null;
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
  snakeHamiltonianCycle = SNAKE_HAMILTONIAN_CYCLE;
  snakeHamiltonianIndex = indexSnakeCycle(snakeHamiltonianCycle);
  snakeAutoPlan = null;
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
  trackEvent('easter_egg_open', {
    trigger: 'profile_photo_click',
  });
  snakeAutoSolve = true;
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

function setSnakeDirection(directionKey) {
  if (!directionKey) return;
  if (snakeBody.length > 1 && SNAKE_OPPOSITE[snakeDirection] === directionKey) return;
  const wasAuto = snakeAutoSolve;
  snakeAutoSolve = false;
  snakeAutoPlan = null;
  snakeNextDirection = directionKey;
  updateEasterHud();
  if (wasAuto && !snakeGameOver && !snakeWon) startSnakeLoop();
}

if (heroPhotoTrigger && easterEggBackdrop && easterEggBoard && easterEggStatus && easterEggReset && easterEggAuto) {
  buildSnakeBoard();
  renderSnakeBoard();

  heroPhotoTrigger.addEventListener('click', openEasterEgg);
  heroPhotoTrigger.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openEasterEgg();
    }
  });

  easterEggReset.addEventListener('click', resetEasterGame);
  easterEggAuto.addEventListener('click', () => {
    snakeAutoSolve = !snakeAutoSolve;
    // A manual route may not fit the cycle. Never force it onto a fixed tour.
    if (snakeAutoSolve) {
      resetEasterGame();
      return;
    }
    updateEasterHud();
    if (!snakeGameOver && !snakeWon) startSnakeLoop();
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
if ('IntersectionObserver' in window && revealEls.length && !bodyElement.classList.contains('portfolio-page')) {
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

/* ---------------- Native Section Navigation ---------------- */
const sectionIds = ['hero-card', 'about', 'experience', 'projects', 'awards', 'activities', 'skills', 'coursework'];
const navAnchors = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
const railAnchors = Array.from(document.querySelectorAll('.section-rail a[data-rail-target]'));
const sectionMap = sectionIds
  .map((id) => ({ id, el: document.getElementById(id) }))
  .filter((section) => section.el);
let activeSectionId = null;

function setActiveSection(id) {
  if (id === activeSectionId) return;
  activeSectionId = id;
  [...navAnchors, ...railAnchors].forEach((anchor) => {
    const isActive = (anchor.dataset.railTarget || anchor.hash.slice(1)) === id;
    anchor.classList.toggle('active', isActive);
    if (isActive) anchor.setAttribute('aria-current', 'location');
    else anchor.removeAttribute('aria-current');
  });
}

if (bodyElement.classList.contains('portfolio-page') && sectionMap.length) {
  setActiveSection(sectionMap[0].id);

  const progress = document.querySelector('.page-progress');
  let progressFrame = 0;
  const updateProgress = () => {
    progressFrame = 0;
    const distance = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.transform = `scaleX(${distance > 0 ? window.scrollY / distance : 0})`;
    const readingLine = Math.min(window.innerHeight * 0.25, 240);
    const active = window.scrollY >= distance - 2
      ? sectionMap[sectionMap.length - 1]
      : sectionMap.reduce((current, section) =>
        section.el.getBoundingClientRect().top <= readingLine ? section : current,
      sectionMap[0]);
    setActiveSection(active.id);
  };
  window.addEventListener('scroll', () => {
    if (!progressFrame) progressFrame = requestAnimationFrame(updateProgress);
  }, { passive: true });
  window.addEventListener('resize', updateProgress, { passive: true });
  updateProgress();
}

/* ---------------- 60-second Introduction Modal ---------------- */
if (bodyElement.classList.contains('portfolio-page')) {
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;
    const dialog = document.querySelector('.modal-backdrop.open .modal-panel, .easter-backdrop.open .easter-panel');
    if (!dialog) return;
    const controls = Array.from(dialog.querySelectorAll('a[href], button, input, select, textarea, iframe, [tabindex]'))
      .filter((element) => !element.disabled && element.tabIndex >= 0 && element.getClientRects().length);
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (!first) return;
    if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
      event.preventDefault();
      first.focus();
    }
  });
}

const briefToggle = document.querySelector('.brief-toggle');
const briefModalBackdrop = document.getElementById('hero-brief-modal');
const briefModalClose = document.getElementById('brief-modal-close');
let lastBriefTrigger = null;

function openBriefModal() {
  if (!briefModalBackdrop) return;
  lastBriefTrigger = briefToggle;
  briefModalBackdrop.classList.add('open');
  briefModalBackdrop.setAttribute('aria-hidden', 'false');
  bodyElement.classList.add('modal-open');
  setTimeout(() => briefModalClose?.focus(), 50);
}

function closeBriefModal() {
  if (!briefModalBackdrop) return;
  briefModalBackdrop.classList.remove('open');
  briefModalBackdrop.setAttribute('aria-hidden', 'true');
  briefToggle?.setAttribute('aria-expanded', 'false');
  if (!modalBackdrop || !modalBackdrop.classList.contains('open')) bodyElement.classList.remove('modal-open');
  if (lastBriefTrigger && typeof lastBriefTrigger.focus === 'function') lastBriefTrigger.focus();
}

if (briefToggle && briefModalBackdrop) {
  briefToggle.addEventListener('click', () => {
    briefToggle.setAttribute('aria-expanded', 'true');
    openBriefModal();
  });
  briefModalClose?.addEventListener('click', closeBriefModal);
  briefModalBackdrop.addEventListener('click', (event) => {
    if (event.target === briefModalBackdrop) closeBriefModal();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && briefModalBackdrop.classList.contains('open')) closeBriefModal();
  });
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
  const extraLinks = DETAIL_RESOURCE_LINKS[id] || [];

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

  if (extraLinks.length) {
    const h = document.createElement('h4');
    h.textContent = currentLang === 'zh-TW' ? '\u6d77\u5831\u8207\u8cc7\u6599' : 'Posters & Resources';
    modalSections.appendChild(h);

    const wrap = document.createElement('div');
    wrap.className = 'modal-link-row';
    extraLinks.forEach((link) => {
      const a = document.createElement('a');
      a.className = 'modal-link';
      a.href = link.url;
      a.target = '_blank';
      a.rel = 'noreferrer';
      a.textContent = `${link.label} · ${currentLang === 'zh-TW' ? '\u5b8c\u6574\u958b\u555f' : 'Open full'}`;
      wrap.appendChild(a);
    });
    modalSections.appendChild(wrap);

    const preview = extraLinks[0];
    if (preview) {
      const previewWrap = document.createElement('div');
      previewWrap.className = 'modal-preview';

      const iframe = document.createElement('iframe');
      iframe.className = 'modal-preview-frame';
      iframe.src = `${preview.url}#page=1&view=FitH`;
      iframe.title = `${data.title} preview`;
      iframe.loading = 'lazy';

      previewWrap.appendChild(iframe);
      modalSections.appendChild(previewWrap);
    }
  }
}

function openDetail(id, trigger) {
  if (!DETAILS[id]) return;
  trackEvent('detail_open', {
    detail_id: id,
    detail_type: PROJECTS[id] ? 'project' : 'award',
  });
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

document.querySelectorAll('.project-resource-link, .project-preview-frame').forEach((el) => {
  el.addEventListener('click', (event) => event.stopPropagation());
  el.addEventListener('keydown', (event) => event.stopPropagation());
});

document.querySelectorAll('.project-preview-toggle').forEach((button) => {
  button.addEventListener('click', (event) => {
    event.stopPropagation();
    const resource = button.closest('.project-resource');
    const preview = resource?.querySelector('.project-preview');
    if (!preview) return;
    const nextExpanded = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', nextExpanded ? 'true' : 'false');
    preview.hidden = !nextExpanded;
  });
  button.addEventListener('keydown', (event) => event.stopPropagation());
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

modalClose?.addEventListener('click', closeDetail);
modalBackdrop?.addEventListener('click', (e) => {
  if (e.target === modalBackdrop) closeDetail();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalBackdrop?.classList.contains('open')) closeDetail();
});

function attachAnalyticsHandlers() {
  document.querySelectorAll('a[href]').forEach((link) => {
    if (link.dataset.analyticsBound === '1') return;
    link.dataset.analyticsBound = '1';
    link.addEventListener('click', () => {
      let targetUrl;
      try {
        targetUrl = new URL(link.getAttribute('href'), window.location.href);
      } catch (err) {
        return;
      }
      trackEvent('link_click', {
        link_url: targetUrl.href,
        link_text: link.textContent.trim().slice(0, 80),
        outbound: targetUrl.origin !== window.location.origin,
      });
    });
  });
}

function getSectionName(section, index) {
  return normalizeAnalyticsId(
    section.dataset.analyticsSection || section.id || `section_${index + 1}`,
    `section_${index + 1}`
  );
}

function getComponentInfo(element, index) {
  if (element.dataset.project) {
    return { component_type: 'project', component_id: element.dataset.project };
  }
  if (element.dataset.award) {
    return { component_type: 'award', component_id: element.dataset.award };
  }
  return {
    component_type: normalizeAnalyticsId(element.dataset.analyticsComponentType, 'component'),
    component_id: normalizeAnalyticsId(element.dataset.analyticsComponent || `component_${index + 1}`, `component_${index + 1}`),
  };
}

function attachViewTracking() {
  if (!('IntersectionObserver' in window)) return;

  const seenSections = new Set();
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const sectionName = getSectionName(entry.target, Number(entry.target.dataset.analyticsIndex || 0));
        if (seenSections.has(sectionName)) return;
        seenSections.add(sectionName);
        trackEvent('section_view', {
          section_name: sectionName,
          page_path: window.location.pathname,
        });
        sectionObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.45, rootMargin: '0px 0px -12% 0px' }
  );

  Array.from(document.querySelectorAll('main > section, .portfolio-content > section, [data-analytics-section]')).forEach((section, index) => {
    section.dataset.analyticsIndex = String(index);
    sectionObserver.observe(section);
  });

  const seenComponents = new Set();
  const componentObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const info = getComponentInfo(entry.target, Number(entry.target.dataset.analyticsIndex || 0));
        const key = `${info.component_type}:${info.component_id}`;
        if (seenComponents.has(key)) return;
        seenComponents.add(key);
        trackEvent('component_view', {
          ...info,
          page_path: window.location.pathname,
        });
        componentObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.6, rootMargin: '0px 0px -10% 0px' }
  );

  Array.from(document.querySelectorAll('[data-project], [data-award], [data-analytics-component]')).forEach((component, index) => {
    component.dataset.analyticsIndex = String(index);
    componentObserver.observe(component);
  });
}

/* ---------------- Initialize ---------------- */
setLanguage(currentLang);
attachCopyHandlers();
attachAnalyticsHandlers();
attachViewTracking();
