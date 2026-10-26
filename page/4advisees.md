---
layout: page
title: Advisees
hide_title: true
permalink: /advisees/
icon: users
description: "Students advised by Guangjing Wang in the RAISE Lab at USF, with suggested reading on doctoral study, academic writing, and research papers."
---

* content
{:toc}




<div class="lab-banner">
    <a href="https://github.com/RaiseAILab">
        Reliable Agentic Intelligence and Secure Ecosystems Laboratory
    </a>
    <p class="lab-tagline">Find problems. Solve problems. Learn to present. Learn to write.</p>
</div>

##### PhD Students

- [Yuwen Cui](https://www.linkedin.com/in/yuwencui1/) <small>(Prev-Advisor: Dr. Yao Liu)</small>

- [Changjia Zhu](https://www.linkedin.com/in/changjia-zhu-94767b24a/) <small>(Prev-Advisor: Dr. Yao Liu)</small>

- [Alabi Mehzabin Anisha](https://www.linkedin.com/in/realamanisha/) <small>(Co-advised with Dr. Sriram Chellappan)</small>

- [Kai Wei](https://www.linkedin.com/in/kaiwei2000/)

- [Kehan Shen](https://www.linkedin.com/in/khan-shen-4a5725119)

- [Tural Hagverdiyev](https://www.linkedin.com/in/hagverdiyevtural/)

- Advisory Committee for

    - [Mahammed Kamruzzaman](https://www.linkedin.com/in/mahammed-kamruzzaman-b59748186/) <small>(Advisor: Dr. Gene Louis Kim)</small>

    - Yucheng Zhao <small>(Advisor: Dr. Henian Chen)</small>

    - [Zhengyuan Jiang](https://www.linkedin.com/in/zhengyuanjiang/) <small>(Advisor: Dr. Ning Wang)</small>

    - [Chi Zhang](https://www.linkedin.com/in/chi-zhang-6a092b1aa/) <small>(Prev-Advisor: Dr. Yao Liu)</small>

    - [Xiaowen Li](https://www.linkedin.com/in/xiaowen-lee-li/) <small>(Prev-Advisor: Dr. Yao Liu; Graduated)</small>

    - [Jiahao Xue](https://www.linkedin.com/in/jiahao-xue-a78324203/) <small>(Advisor: Dr. Zhuo Lu; Graduated)</small>

    - [Xiaoran Xu](https://www.linkedin.com/in/xiaoran-xu-38ba07168/) <small>(Advisor: Dr. Ravi Sankar; Graduated)</small>

##### Master Students

- [Mallika Shaik](https://www.linkedin.com/in/mallika-shaik-usf/)

- [Ryan Powers](https://www.linkedin.com/in/rypow/)

- [Dylan Girrens](https://www.linkedin.com/in/dylan-girrens-5b4450207/) <small>(Graduated)</small>

- Suri Ramachandran <small>(Graduated)</small>

- [Srinija Reddy Maddula](https://www.linkedin.com/in/srinija-reddy-maddula-543125256/) <small>(Graduated)</small>

- [Aastha Sharma](https://www.linkedin.com/in/aasthestial/) <small>(Graduated)</small>

- Advisory Committee for

    - [Sudharshan Balaji](https://www.linkedin.com/in/sudharshanbalaji/) <small>(Advisor: Dr. Ning Wang; Graduated)</small>

    - Zhenyi Chen <small>(Advisor: Dr. Yicheng Tu; Graduated)</small>

    - Nitesh Vamshi Bommisetty <small>(Advisor: Dr. Gene Kim; Graduated)</small>

    - Hieu Nguyen <small>(Advisor: Dr. Gene Kim; Graduated)</small>

##### Undergraduates

- [Rodela Ghosh](https://www.linkedin.com/in/rodela-ghosh/)

- Dang Bao Trinh

- [Khanh Vu](https://www.linkedin.com/in/khanhduyvu/) <small>(Graduated)</small>

{% for group in site.data.advisee_resources %}
##### {{ group.title }}

{% for resource in group.resources %}
- [{{ resource.title }}]({{ resource.source }}) - {{ resource.author }}. [{{ resource.pdf_label }}]({{ resource.pdf | relative_url }}).<br>
  {{ resource.description }}
{% endfor %}
{% endfor %}

<small>With thanks to the authors for sharing these resources, and to Douglas Crockford for hosting Strunk's 1918 text. Titles link to the original sources; PDF links open locally saved reading copies.</small>
