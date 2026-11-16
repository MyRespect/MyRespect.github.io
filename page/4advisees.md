---
layout: page
title: Advisees
hide_title: true
permalink: /advisees/
icon: users
page_class: advisees-page
description: "Students advised by Guangjing Wang in the RAISE Lab at USF, with suggested reading on doctoral study, academic writing, and research papers."
---

* content
{:toc}




<div class="lab-banner">
    <a href="https://github.com/RaiseAILab">
        Reliable Agentic Intelligence and Secure Ecosystems Laboratory
    </a>
    <p class="lab-tagline">Identify problems. Solve problems. Learn to present. Learn to write.</p>
</div>

##### PhD Students

{% include student-cards.html role="phd" %}

<p class="committee-label">Advisory committee member for</p>

{% include student-cards.html committee="phd" %}

##### Master's Students

{% include student-cards.html role="ms" %}

<p class="committee-label">Advisory committee member for</p>

{% include student-cards.html committee="ms" %}

##### Undergraduates

{% include student-cards.html role="undergrad" %}

##### RAISE Lab Alumni

{% include student-cards.html alumni=true %}

{% for group in site.data.advisee_resources %}
##### {{ group.title }}

{% for resource in group.resources %}
- [{{ resource.title }}]({{ resource.source }}) - {{ resource.author }}. [{{ resource.pdf_label }}]({{ resource.pdf | relative_url }}).<br>
  {{ resource.description }}
{% endfor %}
{% endfor %}

<small>With thanks to the authors for sharing these resources, and to Douglas Crockford for hosting Strunk's 1918 text. Titles link to the original sources; PDF links open locally saved reading copies.</small>
